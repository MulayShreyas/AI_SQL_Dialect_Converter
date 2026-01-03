import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiFolder, FiRepeat } from 'react-icons/fi';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import ManualInput from './components/ManualInput';
import DialectSelector from './components/DialectSelector';
import StatementPreview from './components/StatementPreview';
import ConversionResults from './components/ConversionResults';
import ProgressBar from './components/ProgressBar';
import { apiService } from './services/api';
import './App.css';

function App() {
    // State management
    const [dialects, setDialects] = useState([]);
    const [formats, setFormats] = useState([]);
    const [sourceDialect, setSourceDialect] = useState('');
    const [targetDialect, setTargetDialect] = useState('');
    const [statements, setStatements] = useState([]);
    const [results, setResults] = useState(null);
    const [isConverting, setIsConverting] = useState(false);

    // Load dialects and formats on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('Loading dialects and formats...');
                const [dialectsData, formatsData] = await Promise.all([
                    apiService.getDialects(),
                    apiService.getFormats(),
                ]);

                console.log('Dialects loaded:', dialectsData);
                console.log('Formats loaded:', formatsData);

                setDialects(dialectsData);
                setFormats(formatsData);

                // Set default values
                if (dialectsData.length >= 2) {
                    setSourceDialect(dialectsData[0]);
                    setTargetDialect(dialectsData[1]);
                    console.log('Default dialects set:', dialectsData[0], '->', dialectsData[1]);
                }
            } catch (error) {
                toast.error('Failed to load configuration');
                console.error('Error loading configuration:', error);
            }
        };

        loadData();
    }, []);

    // Handle file upload
    const handleFileUpload = async (file) => {
        try {
            console.log('Uploading file:', file.name);
            toast.info('Parsing file...');
            const data = await apiService.parseFile(file);
            console.log('File parsed successfully:', data);
            setStatements(data.statements);
            toast.success(`Extracted ${data.count} SQL statement(s)`);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to parse file');
            console.error('File upload error:', error);
        }
    };

    // Handle manual SQL input
    const handleManualInput = async (sqlText) => {
        try {
            console.log('Parsing manual SQL input:', sqlText.substring(0, 100) + '...');
            const data = await apiService.parseSQL(sqlText);
            console.log('SQL parsed successfully:', data);
            setStatements(data.statements);
            toast.success(`Parsed ${data.count} SQL statement(s)`);
        } catch (error) {
            toast.error('Failed to parse SQL');
            console.error('Manual SQL parse error:', error);
        }
    };

    // Handle conversion
    const handleConvert = async () => {
        if (!statements || statements.length === 0) {
            toast.warning('Please provide SQL statements to convert');
            return;
        }

        if (sourceDialect === targetDialect) {
            toast.warning('Source and target dialects must be different');
            return;
        }

        setIsConverting(true);
        setResults(null);

        try {
            toast.info('Converting SQL statements...');
            const data = await apiService.convertSQL(
                statements,
                sourceDialect,
                targetDialect
            );

            setResults(data);

            if (data.success_count > 0) {
                toast.success(`Successfully converted ${data.success_count} statement(s)`);
            }
            if (data.error_count > 0) {
                toast.warning(`${data.error_count} statement(s) failed to convert`);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Conversion failed';
            toast.error(errorMsg);
            console.error(error);
        } finally {
            setIsConverting(false);
        }
    };

    // Handle export
    const handleExport = async (format) => {
        if (!results || !results.results) {
            toast.warning('No results to export');
            return;
        }

        try {
            toast.info(`Generating ${format}...`);
            await apiService.exportResults(
                results.results,
                sourceDialect,
                targetDialect,
                format
            );
            toast.success(`${format} downloaded successfully`);
        } catch (error) {
            toast.error(`Failed to export ${format}`);
            console.error(error);
        }
    };

    // Handle clear results
    const handleClear = () => {
        setResults(null);
        setStatements([]);
    };

    return (
        <div className="app">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Navbar />

            <main className="main-content main-content-full">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-icon">
                       <FiRepeat />
                    </div>
                    <h1 className="hero-title">SQL Queries Converter</h1>
                    <p className="hero-subtitle">
                        Transform SQL queries between dialects with AI-powered precision
                    </p>
                </div>

                <div className="content-container">
                    {/* Input Section */}
                    <div className="input-section">
                        <div className="input-grid">
                            <FileUpload onFileUpload={handleFileUpload} />
                            <ManualInput onSubmit={handleManualInput} />
                        </div>
                    </div>

                    {/* Dialect Selector with Convert Button */}
                    <DialectSelector
                        dialects={dialects}
                        sourceDialect={sourceDialect}
                        targetDialect={targetDialect}
                        onSourceDialectChange={setSourceDialect}
                        onTargetDialectChange={setTargetDialect}
                        onConvert={handleConvert}
                        isConverting={isConverting}
                        canConvert={statements.length > 0}
                    />

                    {/* Preview Section */}
                    {statements.length > 0 && (
                        <StatementPreview statements={statements} />
                    )}

                    {/* Progress Bar */}
                    {isConverting && (
                        <ProgressBar 
                            isActive={isConverting} 
                            message={`Converting ${statements.length} SQL statement(s) to ${targetDialect}...`}
                        />
                    )}

                    {/* Results Section */}
                    {results && (
                        <ConversionResults
                            results={results}
                            formats={formats}
                            onExport={handleExport}
                            onClear={handleClear}
                            sourceDialect={sourceDialect}
                            targetDialect={targetDialect}
                        />
                    )}

                    {/* Empty State */}
                    {statements.length === 0 && !results && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📌</div>
                            <h3>No SQL statements detected yet</h3>
                            <p>Upload a file or paste SQL in the text area above to start the conversion.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="footer">
                    <p>SQL Dialect Converter • Powered by AI • Made with ❤️</p>
                </footer>
            </main>
        </div>
    );
}

export default App;
