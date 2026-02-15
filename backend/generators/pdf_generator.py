from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, XPreformatted
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from typing import List, Dict
from datetime import datetime
import io

class PDFGenerator:
    """
    Generator for creating PDF files with SQL conversion results.
    Uses reportlab for professional PDF generation.
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._create_custom_styles()
    
    def _create_custom_styles(self):
        """Create custom paragraph styles for the PDF."""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#1a1a2e'),
            alignment=TA_CENTER
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=20,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#667eea')
        ))
        
        # SQL code style
        self.styles.add(ParagraphStyle(
            name='SQLCode',
            parent=self.styles['Code'],
            fontSize=9,
            fontName='Courier',
            leftIndent=0,
            rightIndent=0,
            spaceBefore=0,
            spaceAfter=0
        ))
        
        # Notes style
        self.styles.add(ParagraphStyle(
            name='Notes',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            fontName='Helvetica-Oblique',
            leftIndent=20
        ))
    
    def generate(
        self, 
        results: List[Dict], 
        source_dialect: str, 
        target_dialect: str,
        filename: str = None
    ) -> io.BytesIO:
        """
        Generate a PDF file with conversion results.
        
        Args:
            results: List of conversion results
            source_dialect: Source SQL dialect
            target_dialect: Target SQL dialect
            filename: Optional filename (for metadata)
            
        Returns:
            BytesIO buffer containing the PDF
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Build PDF content
        story = []
        
        # Title
        story.append(Paragraph(
            "SQL Dialect Conversion Report",
            self.styles['CustomTitle']
        ))
        
        # Subtitle with metadata
        subtitle_text = f"{source_dialect} -> {target_dialect}<br/>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        story.append(Paragraph(subtitle_text, self.styles['CustomSubtitle']))
        
        story.append(Spacer(1, 20))
        
        # Summary table
        success_count = sum(1 for r in results if r['status'] == 'success')
        error_count = len(results) - success_count
        
        summary_data = [
            ['Summary', ''],
            ['Total Statements', str(len(results))],
            ['Successfully Converted', str(success_count)],
            ['Errors', str(error_count)]
        ]
        
        summary_table = Table(summary_data, colWidths=[2.5*inch, 1.5*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8f8f8')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e0e0e0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(summary_table)
        story.append(Spacer(1, 30))
        
        # Conversion details
        story.append(Paragraph("Conversion Details", self.styles['SectionHeader']))
        story.append(Spacer(1, 10))
        
        for i, result in enumerate(results, 1):
            # Statement header
            status_color = '#10b981' if result['status'] == 'success' else '#ef4444'
            status_text = 'Success' if result['status'] == 'success' else 'Error'
            
            story.append(Paragraph(
                f"<b>Statement {i}</b> <font color='{status_color}'>[{status_text}]</font>",
                self.styles['Heading3']
            ))
            
            # Original SQL
            story.append(Paragraph("<b>Original SQL:</b>", self.styles['Normal']))
            story.append(Spacer(1, 5))
            original_sql = self._escape_sql(result['original'], to_html=False)
            
            # Wrap in table to prevent overlap
            t_orig = Table([[XPreformatted(original_sql, self.styles['SQLCode'])]], colWidths=[6.5*inch])
            t_orig.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e0e0e0')),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(t_orig)
            
            story.append(Spacer(1, 10))
            
            # Converted SQL
            if result['status'] == 'success':
                story.append(Paragraph("<b>Converted SQL:</b>", self.styles['Normal']))
                story.append(Spacer(1, 5))
                converted_sql = self._escape_sql(result['converted'], to_html=False)
                
                # Wrap in table to prevent overlap
                t_conv = Table([[XPreformatted(converted_sql, self.styles['SQLCode'])]], colWidths=[6.5*inch])
                t_conv.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
                    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e0e0e0')),
                    ('LEFTPADDING', (0, 0), (-1, -1), 10),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                    ('TOPPADDING', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ]))
                story.append(t_conv)
            else:
                story.append(Paragraph("<b>Error:</b>", self.styles['Normal']))
                escaped_err = self._escape_sql(result['notes'])
                story.append(Paragraph(escaped_err, self.styles['Notes']))
            
            # Notes
            if result['status'] == 'success' and result.get('notes'):
                story.append(Spacer(1, 5))
                escaped_notes = self._escape_sql(result['notes'])
                story.append(Paragraph(f"<i>Notes: {escaped_notes}</i>", self.styles['Notes']))
            
            story.append(Spacer(1, 20))
            
            # Add page break every 3 statements
            if i % 3 == 0 and i < len(results):
                story.append(PageBreak())
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        return buffer
    
    def _escape_sql(self, sql: str, to_html: bool = True) -> str:
        """Escape special characters for XML/HTML in reportlab."""
        if not sql:
            return ""
        
        escaped = (sql
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;'))
        
        if to_html:
            escaped = escaped.replace('\n', '<br/>')
            
        return escaped
