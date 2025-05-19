import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  RefreshCw, 
  Download, 
  Search,
  Users,
  XCircle,
  FileUp,
  CheckCircle,
  CalendarClock
} from 'lucide-react';
import { RegulatoryReport } from '../../../types/banking';

const RegulatoryReporting: React.FC = () => {
  const { regulatoryReports, updateTreasuryData } = useBankingContext();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  // Filter reports
  const filteredReports = regulatoryReports.filter(report => {
    // Filter by status
    if (statusFilter !== 'all' && report.status !== statusFilter) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && report.priority !== priorityFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.id.toLowerCase().includes(query) ||
        report.name.toLowerCase().includes(query) ||
        report.authority.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort reports by due date (nearest first)
  filteredReports.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  // Get overdue and due soon reports
  const today = new Date();
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);
  
  const overdueReports = regulatoryReports.filter(
    r => r.dueDate < today && (r.status === 'pending' || r.status === 'in-progress')
  );
  
  const dueSoonReports = regulatoryReports.filter(
    r => r.dueDate >= today && r.dueDate <= twoWeeksFromNow && 
    (r.status === 'pending' || r.status === 'in-progress')
  );
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Get days until due for a report
  const getDaysUntilDue = (dueDate: Date) => {
    const differenceTime = dueDate.getTime() - today.getTime();
    const differenceDays = Math.ceil(differenceTime / (1000 * 3600 * 24));
    
    if (differenceDays < 0) {
      return `${Math.abs(differenceDays)} days overdue`;
    } else if (differenceDays === 0) {
      return 'Due today';
    } else if (differenceDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${differenceDays} days`;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: RegulatoryReport['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FileUp className="h-3 w-3 mr-1" />
            Submitted
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CalendarClock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: RegulatoryReport['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Low
          </span>
        );
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    updateTreasuryData();
    setTimeout(() => setIsLoading(false), 1000);
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-indigo-600 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-indigo-900">Regulatory Reporting Dashboard</h2>
              <p className="text-sm text-indigo-700">Track and manage regulatory filing requirements and deadlines</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {/* Alert Banners */}
        <div className="mt-4 space-y-3">
          {overdueReports.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Overdue Reports</h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    {overdueReports.length} report{overdueReports.length !== 1 ? 's' : ''} overdue. 
                    Urgent attention required for {overdueReports[0].name}.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {dueSoonReports.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Reports Due Soon</h3>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    {dueSoonReports.length} report{dueSoonReports.length !== 1 ? 's' : ''} due in the next 14 days.
                    Next due: {dueSoonReports[0].name} on {formatDate(dueSoonReports[0].dueDate)}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-xs text-gray-600 mr-2">Status:</span>
            </div>
            
            <div className="flex space-x-1 overflow-x-auto">
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All Reports
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'pending' 
                    ? 'bg-gray-200 text-gray-800 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('pending')}
              >
                <CalendarClock className="inline-block h-3 w-3 mr-1" />
                Pending
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'in-progress' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('in-progress')}
              >
                <Clock className="inline-block h-3 w-3 mr-1" />
                In Progress
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'submitted' 
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('submitted')}
              >
                <FileUp className="inline-block h-3 w-3 mr-1" />
                Submitted
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'accepted' 
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('accepted')}
              >
                <CheckCircle className="inline-block h-3 w-3 mr-1" />
                Accepted
              </button>
            </div>
            
            <div className="flex items-center ml-3">
              <span className="text-xs text-gray-600 mr-2">Priority:</span>
              
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    priorityFilter === 'all' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('all')}
                >
                  All
                </button>
                
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    priorityFilter === 'critical' 
                      ? 'bg-red-100 text-red-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('critical')}
                >
                  Critical
                </button>
                
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    priorityFilter === 'high' 
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('high')}
                >
                  High
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Regulatory Reporting Calendar</h3>
            <div className="text-sm text-gray-500">
              <Calendar className="inline-block h-4 w-4 mr-1 -mt-0.5" />
              {formatDate(new Date())}
            </div>
          </div>
          
          {/* Timeline view */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {filteredReports.length > 0 ? (
              <div className="relative pb-12">
                <div className="absolute h-full w-0.5 bg-gray-200 left-6 top-0"></div>
                
                <div className="space-y-6">
                  {filteredReports.map((report) => (
                    <div 
                      key={report.id}
                      className={`relative ${
                        selectedReport === report.id ? 'bg-indigo-50 rounded-lg p-2 -ml-2' : ''
                      }`}
                      onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                    >
                      <div className="flex items-start mb-1">
                        <div 
                          className={`absolute h-5 w-5 rounded-full flex items-center justify-center left-4 -ml-2.5 mt-1.5 z-10 ${
                            report.status === 'accepted' 
                              ? 'bg-green-500' 
                              : report.status === 'rejected'
                              ? 'bg-red-500'
                              : report.status === 'submitted'
                              ? 'bg-blue-500'
                              : report.status === 'in-progress'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }`}
                        >
                          {report.status === 'accepted' && <CheckCircle2 className="text-white h-3 w-3" />}
                          {report.status === 'rejected' && <XCircle className="text-white h-3 w-3" />}
                          {(report.status === 'submitted' || report.status === 'in-progress' || report.status === 'pending') && 
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          }
                        </div>
                        
                        <div className="ml-10 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {getDaysUntilDue(report.dueDate)} • {report.authority}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(report.priority)}
                              {getStatusBadge(report.status)}
                            </div>
                          </div>
                          
                          {/* Expanded details */}
                          {selectedReport === report.id && (
                            <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Report Type</p>
                                  <p className="text-sm font-medium capitalize">{report.type}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                  <p className="text-sm font-medium">{formatDate(report.dueDate)}</p>
                                </div>
                                
                                {report.submissionDate && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                                    <p className="text-sm font-medium">{formatDate(report.submissionDate)}</p>
                                  </div>
                                )}
                                
                                {report.assignedTo && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                                    <p className="text-sm font-medium">{report.assignedTo}</p>
                                  </div>
                                )}
                              </div>
                              
                              {report.metrics && report.metrics.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 mb-1">Required Metrics</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {report.metrics.map((metric, index) => (
                                      <span 
                                        key={index}
                                        className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full"
                                      >
                                        {metric}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {report.notes && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                                  <p className="text-sm text-gray-600 italic">{report.notes}</p>
                                </div>
                              )}
                              
                              {(report.status === 'pending' || report.status === 'in-progress') && (
                                <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2 justify-end">
                                  <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                                    <Users className="h-3.5 w-3.5 inline-block mr-1 -mt-0.5" />
                                    Assign
                                  </button>
                                  <button className="px-3 py-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100">
                                    {report.status === 'pending' ? (
                                      <>
                                        <Clock className="h-3.5 w-3.5 inline-block mr-1 -mt-0.5" />
                                        Start Preparation
                                      </>
                                    ) : (
                                      <>
                                        <FileUp className="h-3.5 w-3.5 inline-block mr-1 -mt-0.5" />
                                        Submit Report
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reports match your filters</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryReporting;