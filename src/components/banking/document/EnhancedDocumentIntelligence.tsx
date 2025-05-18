import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  Hash, 
  MapPin, 
  Shield, 
  RefreshCw,
  Eye,
  EyeOff,
  ScanLine,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface EnhancedDocumentIntelligenceProps {
  documentId?: string;
  documentType?: string;
  showDemo?: boolean;
}

const EnhancedDocumentIntelligence: React.FC<EnhancedDocumentIntelligenceProps> = ({
  documentId,
  documentType = 'id', // default to ID
  showDemo = true
}) => {
  const { documents } = useBankingContext();
  const [document, setDocument] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [detectedFields, setDetectedFields] = useState<any | null>(null);
  const [securityFeatures, setSecurityFeatures] = useState<string[]>([]);
  const [confidenceScores, setConfidenceScores] = useState<{[key: string]: number}>({});
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  const [maskSensitiveInfo, setMaskSensitiveInfo] = useState(true);
  
  // Find the document based on id or use demo data
  useEffect(() => {
    if (documentId) {
      const foundDoc = documents.find(doc => doc.id === documentId);
      if (foundDoc) {
        setDocument(foundDoc);
        simulateDocumentProcessing();
      }
    } else if (showDemo) {
      // Create a demo document
      const demoDoc = {
        id: 'demo-' + Date.now(),
        type: documentType,
        status: 'pending',
        path: 'https://images.pexels.com/photos/4055454/pexels-photo-4055454.jpeg', // Generic ID image
        uploadedAt: new Date(),
        metadata: {}
      };
      setDocument(demoDoc);
      simulateDocumentProcessing();
    }
  }, [documentId, documentType, documents, showDemo]);
  
  // Simulate document processing steps
  const simulateDocumentProcessing = () => {
    setIsProcessing(true);
    setCurrentStage(0);
    
    // Simulate each processing stage with delays
    
    // Stage 1: Document detection and classification
    setTimeout(() => {
      setCurrentStage(1);
      // Stage 2: OCR and field extraction
      setTimeout(() => {
        generateDetectedFields();
        setCurrentStage(2);
        // Stage 3: Verification and validation
        setTimeout(() => {
          generateSecurityFeatures();
          setCurrentStage(3);
          // Stage 4: Compliance checks
          setTimeout(() => {
            setCurrentStage(4);
            setIsProcessing(false);
          }, 1500);
        }, 2000);
      }, 2000);
    }, 1500);
  };
  
  // Generate mock detected fields based on document type
  const generateDetectedFields = () => {
    let fields: any = {};
    
    switch(documentType) {
      case 'id':
      case 'passport':
      case 'driver-license':
        fields = {
          fullName: 'John A. Smith',
          dateOfBirth: '04/15/1985',
          documentNumber: 'D123456789',
          expiryDate: '06/22/2027',
          address: '123 Main St, Anytown, CA 90210',
          issuedBy: 'Department of Motor Vehicles',
          issueDate: '06/22/2022',
        };
        break;
        
      case 'utility-bill':
      case 'bank-statement':
        fields = {
          name: 'John A. Smith',
          address: '123 Main St, Anytown, CA 90210',
          accountNumber: '****5678',
          statementDate: '03/15/2023',
          totalAmount: '$134.56',
          dueDate: '04/01/2023',
          provider: documentType === 'utility-bill' ? 'City Power & Water' : 'First National Bank'
        };
        break;
        
      case 'pay-stub':
        fields = {
          employeeName: 'John A. Smith',
          employerId: 'ABC Corporation',
          payPeriod: '03/01/2023 - 03/15/2023',
          grossPay: '$3,845.25',
          netPay: '$2,876.32',
          ytdEarnings: '$18,762.45',
          taxWithheld: '$968.93'
        };
        break;
        
      case 'tax-return':
        fields = {
          taxpayerName: 'John A. Smith',
          taxYear: '2022',
          filingStatus: 'Single',
          adjustedGrossIncome: '$92,450.00',
          totalTax: '$14,726.00',
          taxRefund: '$1,875.00',
          ssn: '***-**-5678'
        };
        break;
    }
    
    // Generate random confidence scores between 70-100%
    const scores: {[key: string]: number} = {};
    Object.keys(fields).forEach(key => {
      scores[key] = Math.floor(Math.random() * 30) + 70;
    });
    
    setDetectedFields(fields);
    setConfidenceScores(scores);
  };
  
  // Generate security features for ID documents
  const generateSecurityFeatures = () => {
    if (documentType === 'id' || documentType === 'passport' || documentType === 'driver-license') {
      const features = [
        'Hologram verified',
        'Microprint detected',
        'UV features present',
        'No evidence of tampering',
        'Machine readable zone intact',
        'Barcode verified'
      ];
      
      // Randomly select 3-5 features
      const numFeatures = Math.floor(Math.random() * 3) + 3;
      const selectedFeatures = [];
      for (let i = 0; i < numFeatures; i++) {
        const index = Math.floor(Math.random() * features.length);
        selectedFeatures.push(features[index]);
        features.splice(index, 1);
      }
      
      setSecurityFeatures(selectedFeatures);
    }
  };
  
  // Get the stage name
  const getStageName = (stage: number) => {
    switch(stage) {
      case 0: return "Starting document processing...";
      case 1: return "Document classification";
      case 2: return "Text extraction & OCR";
      case 3: return "Security feature verification";
      case 4: return "Compliance & validation checks";
      default: return "Processing...";
    }
  };
  
  // Get highlight style for field type
  const getFieldHighlight = (fieldName: string) => {
    if (highlightedFeature === fieldName) {
      const baseStyle = "border-2 absolute rounded-md border-dashed animate-pulse";
      
      switch(fieldName) {
        case 'fullName':
        case 'name':
        case 'employeeName':
        case 'taxpayerName':
          return `${baseStyle} border-blue-500 top-[20%] left-[30%] w-[55%] h-[10%]`;
        case 'dateOfBirth':
          return `${baseStyle} border-green-500 top-[35%] left-[30%] w-[30%] h-[8%]`;
        case 'documentNumber':
        case 'accountNumber':
          return `${baseStyle} border-red-500 top-[50%] left-[45%] w-[40%] h-[8%]`;
        case 'address':
          return `${baseStyle} border-purple-500 top-[65%] left-[30%] w-[60%] h-[10%]`;
        case 'expiryDate':
        case 'dueDate':
        case 'statementDate':
          return `${baseStyle} border-amber-500 top-[80%] left-[60%] w-[25%] h-[8%]`;
        default:
          return `${baseStyle} border-gray-500 top-[40%] left-[40%] w-[30%] h-[10%]`;
      }
    }
    return "";
  };
  
  // Field confidence level text
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return "Very High";
    if (score >= 80) return "High";
    if (score >= 70) return "Medium";
    return "Low";
  };
  
  // Confidence color
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  // If no document is available
  if (!document) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
        <p className="text-gray-600 mb-4">
          Please select or upload a document to see the enhanced document intelligence in action.
        </p>
      </div>
    );
  }
  
  // Mask sensitive information
  const getMaskedValue = (field: string, value: string) => {
    if (!maskSensitiveInfo) return value;
    
    // Fields that should be masked
    const sensitiveFields = [
      'documentNumber', 'ssn', 'accountNumber', 'taxpayerName', 
      'fullName', 'name', 'employeeName', 'dateOfBirth'
    ];
    
    if (sensitiveFields.includes(field)) {
      // Different masking for different field types
      if (field === 'documentNumber' || field === 'accountNumber') {
        return value.replace(/\d(?=\d{4})/g, "*");
      }
      
      if (field === 'ssn') {
        return value.replace(/\d(?=\d{4})/g, "*");
      }
      
      if (field.includes('Name')) {
        const nameParts = value.split(' ');
        return nameParts.map(part => 
          part.charAt(0) + "*".repeat(part.length - 1)
        ).join(' ');
      }
      
      if (field === 'dateOfBirth') {
        // Only show year
        const parts = value.split('/');
        if (parts.length === 3) {
          return `**/**/${parts[2]}`;
        }
      }
    }
    
    return value;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-blue-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Document Intelligence
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {documentType.charAt(0).toUpperCase() + documentType.slice(1).replace('-', ' ')}
            </span>
          </h3>
          
          <div className="flex items-center">
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setMaskSensitiveInfo(!maskSensitiveInfo)}
              title={maskSensitiveInfo ? "Show sensitive information" : "Hide sensitive information"}
            >
              {maskSensitiveInfo ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Document preview with annotation overlay */}
        <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            {/* Document image */}
            {document.path ? (
              <img 
                src={document.path} 
                alt="Document preview" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <FileText className="h-16 w-16 text-gray-300" />
              </div>
            )}
            
            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
                {currentStage === 0 && (
                  <>
                    <RefreshCw className="h-12 w-12 animate-spin mb-3" />
                    <p className="text-lg font-medium">Initializing</p>
                    <p className="text-sm mt-1">Preparing document for analysis...</p>
                  </>
                )}
                
                {currentStage === 1 && (
                  <>
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[90%] h-[90%] border-2 border-green-400 animate-pulse rounded"></div>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ScanLine className="h-12 w-12 text-green-400 mb-3" />
                        <p className="text-lg font-medium">Document Detection</p>
                        <p className="text-sm mt-1">Classifying document type and orientation...</p>
                      </div>
                    </div>
                  </>
                )}
                
                {currentStage === 2 && (
                  <>
                    <div className="absolute inset-0">
                      <div className="h-1 bg-blue-400 animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>
                    <div className="absolute top-2 left-2 right-2 bg-black bg-opacity-60 p-2 rounded">
                      <p className="text-center text-sm font-medium">OCR Text Extraction</p>
                      <div className="mt-1 h-1 bg-gray-700 rounded">
                        <div className="h-1 bg-blue-500 rounded" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    
                    {/* Simulated detection boxes */}
                    <div className="absolute top-[25%] left-[20%] w-[60%] h-[10%] border border-yellow-400 animate-pulse rounded">
                      <div className="absolute top-[-18px] left-0 text-xs bg-yellow-400 px-1 rounded text-black">
                        Name
                      </div>
                    </div>
                    <div className="absolute top-[40%] left-[20%] w-[30%] h-[8%] border border-green-400 animate-pulse rounded">
                      <div className="absolute top-[-18px] left-0 text-xs bg-green-400 px-1 rounded text-black">
                        Date of Birth
                      </div>
                    </div>
                    <div className="absolute top-[55%] left-[20%] w-[40%] h-[8%] border border-red-400 animate-pulse rounded">
                      <div className="absolute top-[-18px] left-0 text-xs bg-red-400 px-1 rounded text-black">
                        ID Number
                      </div>
                    </div>
                    <div className="absolute top-[70%] left-[20%] w-[50%] h-[10%] border border-purple-400 animate-pulse rounded">
                      <div className="absolute top-[-18px] left-0 text-xs bg-purple-400 px-1 rounded text-black">
                        Address
                      </div>
                    </div>
                  </>
                )}
                
                {currentStage === 3 && (
                  <>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Shield className="h-12 w-12 text-green-400 mb-3" />
                      <p className="text-lg font-medium">Security Verification</p>
                      <p className="text-sm mt-1">Examining document security features...</p>
                      
                      <div className="mt-4 w-64 bg-black bg-opacity-50 p-3 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-xs">Hologram validated</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-xs">Microprint detected</span>
                          </div>
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin mr-2" />
                            <span className="text-xs">Checking for alterations...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {currentStage === 4 && (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-400 mb-3" />
                    <p className="text-lg font-medium">Verification Complete</p>
                    <p className="text-sm mt-1">Document processed successfully</p>
                  </>
                )}
              </div>
            )}
            
            {/* Field highlight overlay when not processing */}
            {!isProcessing && detectedFields && (
              <div className="absolute inset-0 pointer-events-none">
                {Object.keys(detectedFields).map(field => 
                  <div key={field} className={getFieldHighlight(field)}></div>
                )}
              </div>
            )}
            
            {/* Security features overlay */}
            {!isProcessing && securityFeatures.length > 0 && highlightedFeature === 'security' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg max-w-xs">
                  <h4 className="font-medium text-gray-900 flex items-center mb-2">
                    <Shield className="h-5 w-5 text-green-600 mr-1.5" />
                    Security Features Detected
                  </h4>
                  <div className="space-y-1">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-1.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Document info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900">Document Information</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                document.status === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : document.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {document.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                {document.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                {document.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Document Type:</span>
                <span className="font-medium text-gray-900">{document.type.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uploaded:</span>
                <span className="font-medium text-gray-900">{document.uploadedAt.toLocaleString()}</span>
              </div>
              {document.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified:</span>
                  <span className="font-medium text-gray-900">{document.verifiedAt.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Extracted information panel */}
        <div className="md:w-1/2 p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Search className="h-5 w-5 text-blue-600 mr-1.5" />
            Extracted Information
            {isProcessing && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </span>
            )}
          </h4>
          
          {isProcessing ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600 text-center">
                {getStageName(currentStage)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(currentStage / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            detectedFields ? (
              <div className="space-y-4">
                {/* Extracted fields */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Extracted Value
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(detectedFields).map(([field, value]) => (
                        <tr 
                          key={field}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onMouseEnter={() => setHighlightedFeature(field)}
                          onMouseLeave={() => setHighlightedFeature(null)}
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {getMaskedValue(field, value as string)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full mr-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    confidenceScores[field] >= 90 ? 'bg-green-500' :
                                    confidenceScores[field] >= 80 ? 'bg-blue-500' :
                                    confidenceScores[field] >= 70 ? 'bg-amber-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{width: `${confidenceScores[field]}%`}}
                                ></div>
                              </div>
                              <span className={`text-xs font-medium ${getConfidenceColor(confidenceScores[field])}`}>
                                {confidenceScores[field]}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Security features (for ID documents) */}
                {(documentType === 'id' || documentType === 'passport' || documentType === 'driver-license') && securityFeatures.length > 0 && (
                  <div 
                    className="bg-green-50 p-4 rounded-lg border border-green-100 cursor-pointer"
                    onMouseEnter={() => setHighlightedFeature('security')}
                    onMouseLeave={() => setHighlightedFeature(null)}
                  >
                    <h5 className="text-sm font-medium text-green-900 flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 mr-1.5" />
                      Security Features Verified
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {securityFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1.5 flex-shrink-0" />
                          <span className="text-sm text-green-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Validation summary */}
                <div className={`p-4 rounded-lg border ${
                  document.status === 'verified' 
                    ? 'bg-green-50 border-green-100' 
                    : document.status === 'rejected'
                    ? 'bg-red-50 border-red-100'
                    : 'bg-blue-50 border-blue-100'
                }`}>
                  <div className="flex items-start">
                    {document.status === 'verified' && (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    {document.status === 'rejected' && (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    {document.status === 'pending' && (
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    
                    <div>
                      <h5 className={`text-sm font-medium ${
                        document.status === 'verified' ? 'text-green-900' :
                        document.status === 'rejected' ? 'text-red-900' :
                        'text-blue-900'
                      }`}>
                        {document.status === 'verified' 
                          ? 'Document Verified Successfully' 
                          : document.status === 'rejected'
                          ? 'Document Verification Failed'
                          : 'Document Verification Pending'}
                      </h5>
                      
                      <p className={`text-sm mt-1 ${
                        document.status === 'verified' ? 'text-green-700' :
                        document.status === 'rejected' ? 'text-red-700' :
                        'text-blue-700'
                      }`}>
                        {document.status === 'verified'
                          ? 'All required information was successfully extracted and verified. This document meets our verification requirements.'
                          : document.status === 'rejected'
                          ? 'There were issues validating this document. Please check the details and try uploading a clearer copy.'
                          : 'Document is being processed. This usually takes less than a minute to complete.'}
                      </p>
                      
                      {document.status === 'rejected' && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-medium text-red-800">Issues detected:</p>
                          <div className="flex items-center text-sm text-red-700">
                            <AlertTriangle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>Document quality too low for reliable extraction</span>
                          </div>
                          <div className="flex items-center text-sm text-red-700">
                            <AlertTriangle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>Expiration date appears to be invalid</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Privacy note */}
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Lock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span>Document data is processed securely and encrypted at rest</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No data extracted</p>
                <button 
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => simulateDocumentProcessing()}
                >
                  Process Document
                </button>
              </div>
            )
          )}
          
          {/* Field type key */}
          {detectedFields && !isProcessing && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="text-xs font-medium text-gray-700 mb-2">Field Legend</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-1.5" />
                  <span className="text-xs text-gray-600">Identity Information</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-green-600 mr-1.5" />
                  <span className="text-xs text-gray-600">Dates</span>
                </div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-red-600 mr-1.5" />
                  <span className="text-xs text-gray-600">ID/Account Numbers</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-purple-600 mr-1.5" />
                  <span className="text-xs text-gray-600">Address Information</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDocumentIntelligence;