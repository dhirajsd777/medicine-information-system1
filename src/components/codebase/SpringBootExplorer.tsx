import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Layers,
  Search,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import JSZip from 'jszip';
import { SPRING_BOOT_PROJECT_FILES } from '../../data/springBootCodebase';
import { CodeFile } from '../../types/pharmacy';

export const SpringBootExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(SPRING_BOOT_PROJECT_FILES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const categories = ['All', ...Array.from(new Set(SPRING_BOOT_PROJECT_FILES.map((f) => f.category)))];

  const filteredFiles = SPRING_BOOT_PROJECT_FILES.filter((file) => {
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files into standard Maven directory structure
      SPRING_BOOT_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add a README.md for the Java Spring Boot project
      const readmeContent = `# Medicine Information & Management System
Enterprise Spring Boot 3 & Java 17 Production Application

## Tech Stack & Architecture
- **Language**: Java 17+
- **Framework**: Spring Boot 3.3.x (Spring Web, Spring Data JPA, Spring Security 6)
- **Database**: H2 (in-memory for development) / MySQL (production profile) with Hibernate ORM
- **UI & Views**: Thymeleaf templates with Bootstrap 5
- **Build Tool**: Apache Maven (pom.xml included)

## Getting Started

### 1. Requirements
- JDK 17 or higher installed
- Apache Maven 3.8+ installed

### 2. Run the Application
\`\`\`bash
# Clean and compile with Maven
mvn clean install

# Launch Spring Boot Application
mvn spring-boot:run
\`\`\`

### 3. Application Access
- Web Application: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console (JDBC URL: \`jdbc:h2:mem:pharmacydb\`, User: \`sa\`, Password: \`password\`)

### 4. Default Seed Credentials
- **Customer Portal**: \`customer@pharma.com\` / \`pass123\`
- **Chief Pharmacist (Admin)**: \`admin@pharma.com\` / \`admin123\`

## Key Enterprise Modules
- **Automated Stock Alerts**: Business Service evaluates stock levels and issues alerts when items drop below 10 units or reach 0 units.
- **Role-Based Security**: Spring Security 6 restricts \`/customer/**\` to \`ROLE_CUSTOMER\` and \`/admin/**\` to \`ROLE_ADMIN\`.
- **Atomic Order Placement**: Deducts inventory within an isolated \`@Transactional\` boundary with stock insufficiency rollbacks.
`;
      zip.file('README.md', readmeContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medicine-management-system-springboot3.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Principal Java Enterprise Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Spring Boot 3.3.x & Java 17 Project Codebase
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete, production-ready source code repository including pom.xml, JPA Entity hierarchies, Spring Data JPA repositories, low-stock alert services, Spring Security 6 filters, and Thymeleaf views.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-download-zip"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Archiving Maven Project...' : 'Download Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Code Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: File Tree & Categories */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter Java files..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[11px]">{file.filename}</div>
                    <div className="text-[10px] text-slate-400 truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Spring Security 6 Architecture</span>
            </div>
            <p>
              Separates <code className="bg-slate-200 px-1 rounded">/customer/**</code> and{' '}
              <code className="bg-slate-200 px-1 rounded">/admin/**</code> with BCryptPasswordEncoder.
            </p>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold text-teal-400 truncate">
                {selectedFile.path}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase border border-slate-700">
                {selectedFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description bar */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 text-xs text-slate-400">
            {selectedFile.description}
          </div>

          {/* Code Text Area with Line Numbers */}
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed select-text">
            <pre className="text-slate-300">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
