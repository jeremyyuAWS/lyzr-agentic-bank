import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Upload, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Check, 
  X, 
  Camera, 
  RefreshCw,
  ScanSearch,
  Aperture,
  FileText,
  TimerReset,
  Lock,
  User,
  CheckCircle
} from 'lucide-react';
import EnhancedDocumentIntelligence from './EnhancedDocumentIntelligence';

interface DocumentVerificationViewProps {
  documentType: string;
  onComplete?: (success: boolean) => void;
}

const DocumentVerificationView: React.FC<DocumentVerificationViewProps> = ({ 
  documentType,
  onComplete 
}) => {
  const { addDocument, documents, addAuditEvent } = useBankingContext();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationStage, setVerificationStage] = useState<'upload' | 'scanning' | 'processing' | 'verifying' | 'complete' | 'failed'>('upload');
  const [progress, setProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    details?: string[];
  } | null>(null);
  const [showEnhancedView, setShowEnhancedView] = useState(false);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Revoke object URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      startVerificationProcess();
    }
  };
  
  // Toggle camera view
  const toggleCamera = () => {
    setShowCamera(!showCamera);
    setCameraError(null);
    
    if (!showCamera) {
      // Try to access the camera when enabling camera view
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.getElementById('camera-preview') as HTMLVideoElement;
          if (video) {
            video.srcObject = stream;
          }
        })
        .catch(err => {
          setCameraError('Could not access camera: ' + err.message);
          setShowCamera(false);
        });
    } else {
      // Stop the camera stream when disabling camera view
      const video = document.getElementById('camera-preview') as HTMLVideoElement;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  };
  
  // Take a photo
  const takePhoto = () => {
    const video = document.getElementById('camera-preview') as HTMLVideoElement;
    
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob(blob => {
        if (blob) {
          // Create a File from the Blob
          const photoFile = new File([blob], 'document-photo.jpg', { type: 'image/jpeg' });
          setFile(photoFile);
          setPreviewUrl(URL.createObjectURL(blob));
          
          // Stop the camera stream
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
          
          setShowCamera(false);
          startVerificationProcess();
        }
      }, 'image/jpeg');
    }
  };
  
  // Start the verification process simulation
  const startVerificationProcess = () => {
    setVerificationStage('scanning');
    setProgress(0);
    
    // Log to audit trail
    addAuditEvent('Document Processing', `Started verification of ${documentType.replace(/-/g, ' ')} document`);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    
    // Scanning phase (OCR)
    setTimeout(() => {
      setVerificationStage('processing');
      
      // Processing phase (data extraction)
      setTimeout(() => {
        setVerificationStage('verifying');
        
        // Verification phase (validation)
        setTimeout(() => {
          // 85% chance of success
          const success = Math.random() < 0.85;
          setVerificationStage(success ? 'complete' : 'failed');
          
          setVerificationResult({
            success,
            message: success ? 
              `${documentType.replace(/-/g, ' ')} verified successfully` : 
              `${documentType.replace(/-/g, ' ')} verification failed`,
            details: success ? 
              [
                'Document appears genuine',
                'All required fields extracted',
                'No evidence of tampering detected'
              ] : 
              [
                'Poor image quality',
                'Document data unreadable',
                'Required information missing'
              ]
          });
          
          // Add document to context
          if (file) {
            const docStatus = success ? 'verified' : 'rejected';
            addDocument({
              type: documentType as any,
              status: docStatus,
              path: previewUrl || '',
            });
            
            // Log to audit trail
            addAuditEvent('Document Verification', 
              `Document ${documentType.replace(/-/g, ' ')} verification ${docStatus}: ${
                success ? 'Document verified successfully' : 'Verification failed, document rejected'
              }`
            );
          }
          
          if (onComplete) {
            onComplete(success);
          }
        }, 2000);
      }, 2000);
    }, 2000);
  };
  
  // Reset the verification process
  const resetVerification = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setVerificationStage('upload');
    setProgress(0);
    setVerificationResult(null);
    setShowEnhancedView(false);
  };
  
  // Retry verification
  const retryVerification = () => {
    resetVerification();
  };
  
  // Get friendly document type name
  const getDocumentTypeName = () => {
    switch (documentType) {
      case 'id':
        return 'ID Card';
      case 'passport':
        return 'Passport';
      case 'driver-license':
        return 'Driver\'s License';
      case 'utility-bill':
        return 'Utility Bill';
      case 'bank-statement':
        return 'Bank Statement';
      case 'pay-stub':
        return 'Pay Stub';
      case 'tax-return':
        return 'Tax Return';
      default:
        return documentType.replace(/-/g, ' ');
    }
  };

  // If we're showing the enhanced view, render the EnhancedDocumentIntelligence component
  if (showEnhancedView) {
    const docId = documents.find(d => d.type === documentType)?.id;
    return (
      <>
        <EnhancedDocumentIntelligence 
          documentId={docId} 
          documentType={documentType}
          showDemo={!docId}
        />
        <div className="text-right mt-4">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setShowEnhancedView(false)}
          >
            Back to Standard View
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-medium text-indigo-900 flex items-center">
              <FileText className="h-5 w-5 text-indigo-600 mr-2" />
              {getDocumentTypeName()} Verification
            </h3>
            <p className="text-xs text-indigo-700">
              Upload or take a photo of your {getDocumentTypeName().toLowerCase()} for secure verification
            </p>
          </div>
          {verificationStage !== 'upload' && (
            <button
              onClick={() => setShowEnhancedView(true)}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full hover:bg-indigo-200 transition-colors"
            >
              Show Enhanced Intelligence View
            </button>
          )}
        </div>
      </div>
      
      {showCamera ? (
        /* Camera capture view */
        <div className="p-4">
          {cameraError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{cameraError}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 mb-4 relative">
              <video 
                id="camera-preview" 
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Camera UI overlay */}
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white opacity-70">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-3/5 border-2 border-white rounded-lg">
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white rounded-tl"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white rounded-tr"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white rounded-bl"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white rounded-br"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  <Aperture className="h-3 w-3 inline mr-1" />
                  <span>Align document within frame</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button 
              onClick={toggleCamera} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
            >
              <X className="h-4 w-4 inline mr-1" />
              Cancel
            </button>
            
            <button 
              onClick={takePhoto} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center"
              disabled={!!cameraError}
            >
              <Camera className="h-4 w-4 mr-1.5" />
              Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          {verificationStage === 'upload' ? (
            /* Upload view */
            <div>
              {/* File drop zone */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer bg-gray-50"
                onClick={() => document.getElementById('document-upload')?.click()}
              >
                <input
                  type="file"
                  id="document-upload"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <Upload className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Upload your {getDocumentTypeName()}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG, PDF (max 10MB)
                </p>
              </div>
              
              <div className="mt-4 flex items-center justify-center">
                <div className="text-xs text-gray-500 mr-2">or</div>
                <button 
                  onClick={toggleCamera}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-md border border-indigo-200 flex items-center"
                >
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Take a Photo
                </button>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg flex">
                <Lock className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Security Assurance</p>
                  <p>Your document is processed securely with bank-grade encryption. All sensitive data is handled in compliance with privacy regulations and is never stored longer than required for verification.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Verification process view */
            <div>
              {/* Document preview */}
              {previewUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 aspect-video relative">
                  <img 
                    src={previewUrl} 
                    alt="Document preview" 
                    className="w-full h-full object-contain bg-gray-50"
                  />
                  
                  {/* Scan overlay during scanning phase */}
                  {verificationStage === 'scanning' && (
                    <div className="absolute inset-0 bg-indigo-900/20 flex flex-col items-center justify-center">
                      <div className="w-full h-10 bg-indigo-500/30 animate-pulse absolute" style={{
                        top: `${progress}%`,
                        transform: 'translateY(-50%)',
                        transition: 'top 0.3s ease-out'
                      }}></div>
                      <ScanSearch className="h-12 w-12 text-white drop-shadow-lg animate-pulse" />
                    </div>
                  )}
                  
                  {/* Document analysis visualization during processing */}
                  {verificationStage === 'processing' && (
                    <div className="absolute inset-0">
                      {/* Simulated data extraction points */}
                      <div className="absolute top-[20%] left-[20%] h-8 w-32 border-2 border-blue-500 rounded-sm animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs text-blue-600 bg-white px-1 rounded">Name</div>
                      </div>
                      <div className="absolute top-[35%] left-[20%] h-8 w-48 border-2 border-green-500 rounded-sm animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs text-green-600 bg-white px-1 rounded">Address</div>
                      </div>
                      <div className="absolute top-[50%] left-[20%] h-8 w-28 border-2 border-amber-500 rounded-sm animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs text-amber-600 bg-white px-1 rounded">DOB</div>
                      </div>
                      <div className="absolute top-[65%] left-[20%] h-8 w-36 border-2 border-purple-500 rounded-sm animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs text-purple-600 bg-white px-1 rounded">ID Number</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Verification indicators */}
                  {verificationStage === 'verifying' && (
                    <div className="absolute inset-0 bg-gray-800/30 flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg p-4 flex items-center">
                        <RefreshCw className="h-5 w-5 text-indigo-600 animate-spin mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Verifying document</p>
                          <p className="text-xs text-gray-500">Checking against secure databases</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Success overlay */}
                  {verificationStage === 'complete' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-5 shadow-lg">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-center font-medium text-gray-900">Verification Complete</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Failure overlay */}
                  {verificationStage === 'failed' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-5 shadow-lg">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="text-center font-medium text-gray-900">Verification Failed</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Status indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Verification Progress</p>
                  <p className="text-xs text-gray-500">
                    {verificationStage === 'scanning' && 'Scanning document...'}
                    {verificationStage === 'processing' && 'Extracting information...'}
                    {verificationStage === 'verifying' && 'Verifying authenticity...'}
                    {verificationStage === 'complete' && 'Verification complete'}
                    {verificationStage === 'failed' && 'Verification failed'}
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      verificationStage === 'failed' 
                        ? 'bg-red-500' 
                        : 'bg-indigo-600'
                    } transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                {/* Status steps */}
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      ['scanning', 'processing', 'verifying', 'complete', 'failed'].includes(verificationStage)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Upload className="h-3 w-3" />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      ['scanning', 'processing', 'verifying', 'complete', 'failed'].includes(verificationStage)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <ScanSearch className="h-3 w-3" />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Scan</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      ['processing', 'verifying', 'complete', 'failed'].includes(verificationStage)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <User className="h-3 w-3" />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Extract</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      ['verifying', 'complete', 'failed'].includes(verificationStage)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Lock className="h-3 w-3" />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Verify</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      verificationStage === 'complete'
                        ? 'bg-green-600 text-white'
                        : verificationStage === 'failed'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {verificationStage === 'complete' ? (
                        <Check className="h-3 w-3" />
                      ) : verificationStage === 'failed' ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Result</span>
                  </div>
                </div>
              </div>
              
              {/* Verification result */}
              {verificationResult && (
                <div className={`rounded-lg p-4 mb-4 ${
                  verificationResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    {verificationResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    )}
                    
                    <div>
                      <h4 className={`font-medium text-sm ${
                        verificationResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {verificationResult.message}
                      </h4>
                      
                      {verificationResult.details && (
                        <ul className={`mt-2 text-xs space-y-1 list-disc pl-4 ${
                          verificationResult.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {verificationResult.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex justify-between">
                {(verificationStage === 'complete' || verificationStage === 'failed') && (
                  <>
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      onClick={resetVerification}
                    >
                      {verificationStage === 'complete' ? 'Done' : 'Cancel'}
                    </button>
                    
                    {verificationStage === 'failed' && (
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center"
                        onClick={retryVerification}
                      >
                        <TimerReset className="h-4 w-4 mr-1.5" />
                        Try Again
                      </button>
                    )}
                    
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center"
                      onClick={() => setShowEnhancedView(true)}
                    >
                      <ScanSearch className="h-4 w-4 mr-1.5" />
                      View Enhanced Analysis
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentVerificationView;