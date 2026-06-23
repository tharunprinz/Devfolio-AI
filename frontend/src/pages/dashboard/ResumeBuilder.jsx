import React, { useState, useEffect } from 'react';
import { 
  Sparkle, 
  Save, 
  Printer, 
  FileText, 
  Plus, 
  Trash, 
  Wand2, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { resumesApi } from '../../services/api';

export default function ResumeBuilder() {
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  
  // Custom states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [polishInstructions, setPolishInstructions] = useState('');
  
  // Resume state
  const [templateName, setTemplateName] = useState('modern');
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    fetchInitialResume();
  }, []);

  const fetchInitialResume = async () => {
    setLoading(true);
    try {
      const res = await resumesApi.getResumes();
      setResumes(res.data);
      if (res.data.length > 0) {
        loadResumeToEditor(res.data[0]);
      } else {
        // Create initial
        const initRes = await resumesApi.createResume('modern');
        setResumes([initRes.data]);
        loadResumeToEditor(initRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadResumeToEditor = (res) => {
    setActiveResume(res);
    setTemplateName(res.templateName);
    try {
      setResumeData(JSON.parse(res.generatedResume));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!activeResume) return;
    setSaving(true);
    try {
      const payload = {
        templateName,
        generatedResume: resumeData
      };
      const res = await resumesApi.updateResume(activeResume.id, payload);
      setResumes(prev => prev.map(r => r.id === activeResume.id ? res.data : r));
      setActiveResume(res.data);
      alert('Resume configurations saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleAiPolish = async () => {
    if (!activeResume) return;
    setPolishing(true);
    try {
      const res = await resumesApi.polishResume(activeResume.id, polishInstructions || "Polish professional wording.");
      setResumes(prev => prev.map(r => r.id === activeResume.id ? res.data : r));
      setActiveResume(res.data);
      setResumeData(JSON.parse(res.data.generatedResume));
      alert('Resume polished by AI successfully!');
    } catch (e) {
      console.error(e);
      alert('AI polish failed.');
    } finally {
      setPolishing(false);
    }
  };

  const handleAddField = (section, itemTemplate) => {
    if (!resumeData) return;
    const current = [...(resumeData[section] || [])];
    current.push(itemTemplate);
    setResumeData(prev => ({ ...prev, [section]: current }));
  };

  const handleRemoveField = (section, idx) => {
    if (!resumeData) return;
    const current = [...(resumeData[section] || [])];
    current.splice(idx, 1);
    setResumeData(prev => ({ ...prev, [section]: current }));
  };

  const handleExportPdf = () => {
    // Generate clean print layout view in new window and call print
    const printWindow = window.open('', '_blank');
    const header = resumeData.header || {};
    const experiences = resumeData.experience || [];
    const projects = resumeData.projects || [];
    const education = resumeData.education || [];
    const certifications = resumeData.certifications || [];
    const skills = resumeData.skills || {};

    const htmlContent = `
      <html>
      <head>
        <title>Resume - ${header.name || ''}</title>
        <style>
          body { font-family: 'Georgia', 'Times New Roman', serif; color: #111; margin: 40px; font-size: 13px; line-height: 1.5; }
          h1 { text-align: center; margin-bottom: 5px; font-size: 26px; font-weight: normal; }
          .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 25px; font-family: sans-serif; }
          .section-title { font-size: 14px; font-weight: bold; border-bottom: 1px solid #aaa; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; font-family: sans-serif; letter-spacing: 0.5px; }
          .item { margin-bottom: 12px; }
          .item-header { display: flex; justify-content: space-between; font-weight: bold; }
          .item-sub { display: flex; justify-content: space-between; font-style: italic; color: #444; margin-bottom: 4px; }
          ul { margin: 4px 0 0 18px; padding: 0; }
          li { margin-bottom: 3px; }
          .skills-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
          .skills-category { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${header.name || ''}</h1>
        <div class="subtitle">
          ${header.location || ''} &bull; ${header.phone || ''} &bull; ${header.email || ''} <br>
          ${header.github || ''} &bull; ${header.website || ''}
        </div>

        <div class="section-title">Summary</div>
        <p style="margin: 0; text-align: justify;">${resumeData.summary || ''}</p>

        <div class="section-title">Experience</div>
        ${experiences.map(exp => `
          <div class="item">
            <div class="item-header">
              <span>${exp.role || ''}</span>
              <span style="font-weight: normal; font-size: 11px;">${exp.dates || ''}</span>
            </div>
            <div class="item-sub">
              <span>${exp.company || ''}</span>
              <span style="font-weight: normal; font-size: 11px;">${exp.location || ''}</span>
            </div>
            <ul>
              ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="section-title">Projects</div>
        ${projects.map(proj => `
          <div class="item">
            <div class="item-header">
              <span>${proj.title || ''} &mdash; <span style="font-weight: normal; font-size: 12px; font-style: italic;">${proj.role || ''}</span></span>
              <span style="font-weight: normal; font-size: 11px;">${(proj.technologies || []).join(', ')}</span>
            </div>
            <ul>
              ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="section-title">Skills</div>
        <div class="skills-grid">
          ${Object.entries(skills).map(([category, items]) => `
            <div>
              <span class="skills-category">${category}:</span>
              <span>${(items || []).join(', ')}</span>
            </div>
          `).join('')}
        </div>

        <div class="section-title">Education</div>
        ${education.map(edu => `
          <div class="item">
            <div class="item-header">
              <span>${edu.institution || ''}</span>
              <span style="font-weight: normal; font-size: 11px;">${edu.dates || ''}</span>
            </div>
            <div style="font-style: italic;">${edu.degree || ''}</div>
          </div>
        `).join('')}

        <div class="section-title">Certifications</div>
        <p style="margin: 0;">${certifications.join(', ')}</p>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading || !resumeData) {
    return <div className="py-20 text-center text-gray-400 text-xs select-none">Loading resume workspace builder...</div>;
  }

  return (
    <div className="space-y-6 text-left relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Builder</h1>
          <p className="text-gray-400 text-sm mt-1">Compile your synced project stats and work history into an ATS-friendly format.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-xs hover:from-orange-400 hover:to-amber-300 transition-all cursor-pointer border border-orange-500/20 shadow-lg shadow-orange-500/20 btn-glow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 text-white font-semibold text-xs hover:bg-white/15 disabled:opacity-50 transition-colors cursor-pointer border border-white/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save CV'}</span>
          </button>
        </div>
      </div>

      {/* Editor Split Layout */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left column: Form Fields */}
        <div className="lg:col-span-2 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          
          {/* AI Polisher Controls */}
          <div className="glass-panel p-6 bg-orange-500/5 border border-orange-500/15 space-y-4">
            <h2 className="font-bold text-sm text-orange-300 flex items-center gap-2 select-none">
              <Wand2 className="w-4 h-4 text-orange-400" />
              <span>AI ATS Enhancer</span>
            </h2>
            <p className="text-gray-400 text-xs select-none">Enter formatting targets (e.g. "make bullets sound more impact-driven" or "highlight React/Spring Boot keywords").</p>
            <div className="space-y-3">
              <input 
                type="text" 
                value={polishInstructions}
                onChange={(e) => setPolishInstructions(e.target.value)}
                placeholder="Custom refinement instructions..."
                className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none"
              />
              <button
                onClick={handleAiPolish}
                disabled={polishing}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none btn-glow"
              >
                {polishing ? 'Improving wording...' : 'Polish Complete Resume'}
              </button>
            </div>
          </div>

          {/* Contact details */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
            <h2 className="font-bold text-sm text-white select-none">Header Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Display Name</label>
                <input 
                  type="text"
                  value={resumeData.header?.name || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    header: { ...resumeData.header, name: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Email Address</label>
                <input 
                  type="text"
                  value={resumeData.header?.email || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    header: { ...resumeData.header, email: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Phone Contact</label>
                <input 
                  type="text"
                  value={resumeData.header?.phone || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    header: { ...resumeData.header, phone: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Location City</label>
                <input 
                  type="text"
                  value={resumeData.header?.location || ''}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    header: { ...resumeData.header, location: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Professional summary text */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-3">
            <h2 className="font-bold text-sm text-white select-none">Summary Statement</h2>
            <textarea
              value={resumeData.summary || ''}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              rows={4}
              className="w-full p-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none leading-relaxed resize-none"
            />
          </div>

          {/* Work experience list */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center select-none">
              <h2 className="font-bold text-sm text-white">Work Experience</h2>
              <button 
                onClick={() => handleAddField('experience', { role: 'Engineer', company: 'New Company', dates: '2024 - Present', bullets: ['Built things.'] })}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-orange-500/10 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {resumeData.experience?.map((job, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 relative text-xs space-y-3">
                  <button 
                    onClick={() => handleRemoveField('experience', idx)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={job.role || ''} 
                      placeholder="Role"
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].role = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                      className="p-2 rounded bg-black/40 border border-white/5 text-white outline-none"
                    />
                    <input 
                      type="text" 
                      value={job.company || ''} 
                      placeholder="Company"
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                      className="p-2 rounded bg-black/40 border border-white/5 text-white outline-none"
                    />
                  </div>
                  <textarea
                    value={job.bullets?.join('\n') || ''}
                    placeholder="Duties / Achievements (One per line)"
                    rows={3}
                    onChange={(e) => {
                      const copy = [...resumeData.experience];
                      copy[idx].bullets = e.target.value.split('\n');
                      setResumeData({ ...resumeData, experience: copy });
                    }}
                    className="w-full p-2 rounded bg-black/40 border border-white/5 text-white outline-none leading-relaxed resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Print sheet preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2 select-none">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>ATS Resume Layout Preview</span>
            </span>
          </div>

          {/* Printable Layout Container */}
          <div className="w-full aspect-[1/1.4] rounded-2xl border border-white/10 bg-white text-black p-8 shadow-2xl overflow-y-auto scrollbar-none font-serif text-[11px] leading-relaxed text-left select-text">
            
            {/* Header info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-normal text-black m-0 mb-1">{resumeData.header?.name || 'Your Name'}</h2>
              <div className="text-[9px] text-gray-600 font-sans tracking-wide">
                {resumeData.header?.location || 'San Francisco, CA'} &bull; {resumeData.header?.phone || '+1 555-0100'} &bull; {resumeData.header?.email || 'email@example.com'} <br />
                {resumeData.header?.github || 'github.com/username'} &bull; {resumeData.header?.website || 'portfolio.dev'}
              </div>
            </div>

            {/* Summary */}
            <div className="border-b border-gray-300 pb-1 mb-2 font-sans font-bold text-[10px] text-gray-800 tracking-wider uppercase select-none">Summary</div>
            <p className="m-0 mb-4 text-justify">{resumeData.summary}</p>

            {/* Experience */}
            <div className="border-b border-gray-300 pb-1 mb-2 font-sans font-bold text-[10px] text-gray-800 tracking-wider uppercase select-none">Experience</div>
            <div className="space-y-3 mb-4">
              {resumeData.experience?.map((exp, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{exp.role}</span>
                    <span className="font-normal font-sans text-[9px] text-gray-600">{exp.dates}</span>
                  </div>
                  <div className="flex justify-between italic text-gray-700 text-[10px]">
                    <span>{exp.company}</span>
                    <span className="font-normal font-sans text-[9px]">{exp.location}</span>
                  </div>
                  <ul className="list-disc pl-4 m-0 mt-1 space-y-0.5">
                    {exp.bullets?.filter(b => b.trim() !== '').map((bullet, bIdx) => (
                      <li key={bIdx} className="m-0 pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="border-b border-gray-300 pb-1 mb-2 font-sans font-bold text-[10px] text-gray-800 tracking-wider uppercase select-none">Projects</div>
            <div className="space-y-3 mb-4">
              {resumeData.projects?.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{proj.title} &mdash; <span className="font-normal italic text-[10px] text-gray-700">{proj.role}</span></span>
                    <span className="font-normal font-sans text-[9px] text-gray-600">{(proj.technologies || []).join(', ')}</span>
                  </div>
                  <ul className="list-disc pl-4 m-0 mt-1 space-y-0.5">
                    {proj.bullets?.filter(b => b.trim() !== '').map((bullet, bIdx) => (
                      <li key={bIdx} className="m-0 pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="border-b border-gray-300 pb-1 mb-2 font-sans font-bold text-[10px] text-gray-800 tracking-wider uppercase select-none">Skills</div>
            <div className="space-y-1 mb-4">
              {Object.entries(resumeData.skills || {}).map(([cat, list]) => (
                <div key={cat}>
                  <span className="font-bold text-gray-800">{cat}: </span>
                  <span>{(list || []).join(', ')}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
