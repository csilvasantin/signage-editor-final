import { Layout, Palette, Layers, Settings, Monitor, Smartphone, Maximize, PlusCircle, Download, CheckCircle2, Loader2, PlayCircle } from 'lucide-react';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { useCompositionStore } from './store/useCompositionStore';
import { useState } from 'react';

function App() {
  const { 
    width, height, fps, elements, addElement, updateElement, updateComposition, 
    currentFrame, durationInFrames, isRendering, setRendering, renderProgress, setRenderProgress 
  } = useCompositionStore();
  
  const [showRenderModal, setShowRenderModal] = useState(false);

  const setResolution = (w: number, h: number) => {
    updateComposition({ width: w, height: h });
  };

  const formatTime = (frame: number) => {
    const totalSeconds = Math.floor(frame / 30);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor(((frame / 30) % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleExport = () => {
    setRendering(true);
    setShowRenderModal(true);
    setRenderProgress(0);

    // Mock rendering progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setRendering(false);
      }
      setRenderProgress(progress);
    }, 400);
  };

  const downloadConfig = () => {
    const config = { width, height, fps, durationInFrames, elements };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signage-composition-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-editor-bg text-gray-200">
      {/* Top Bar */}
      <header className="h-12 border-b border-editor-border flex items-center px-4 justify-between bg-editor-panel shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-editor-accent rounded flex items-center justify-center font-bold text-white shadow-lg">S</div>
          <span className="font-semibold tracking-tight text-white">Signage Editor <span className="text-gray-500 font-normal">| 1.0</span></span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadConfig}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-all border border-gray-600"
          >
            <Download size={16} /> JSON
          </button>
          <button 
            onClick={handleExport}
            disabled={isRendering}
            className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-bold text-white transition-all shadow-md ${isRendering ? 'bg-gray-600 opacity-50' : 'bg-editor-accent hover:bg-blue-600'}`}
          >
            {isRendering ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
            {isRendering ? 'Renderizando...' : 'Exportar MP4'}
          </button>
        </div>
      </header>

      {/* Render Modal Overlay */}
      {showRenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-editor-panel w-full max-w-md border border-editor-border rounded-xl shadow-2xl p-6">
             <div className="flex flex-col items-center text-center gap-4">
                {isRendering ? (
                  <>
                    <Loader2 size={48} className="text-editor-accent animate-spin" />
                    <h2 className="text-xl font-bold">Generando video...</h2>
                    <p className="text-sm text-gray-400">Estamos interpretando todos los widgets dinámicos y animaciones.</p>
                    <div className="w-full bg-editor-bg h-3 rounded-full overflow-hidden border border-editor-border mt-2">
                       <div 
                        className="bg-editor-accent h-full transition-all duration-300" 
                        style={{ width: `${renderProgress}%` }}
                       ></div>
                    </div>
                    <span className="text-xs font-mono">{Math.floor(renderProgress)}%</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={48} className="text-green-500" />
                    <h2 className="text-xl font-bold">¡Video Listo!</h2>
                    <p className="text-sm text-gray-400 mb-4">El video ha sido renderizado exitosamente con Remotion.</p>
                    <div className="bg-black/50 p-3 rounded border border-editor-border w-full mb-4 text-left">
                       <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider font-bold">Comando de Render CLI:</span>
                       <code className="text-xs text-blue-400 break-all">npx remotion render src/index.ts Main {width}x{height} --input-props='{JSON.stringify({elements}).substring(0, 30)}...'</code>
                    </div>
                    <button 
                      onClick={() => setShowRenderModal(false)}
                      className="w-full py-2 bg-editor-accent rounded font-bold hover:bg-blue-600"
                    >
                      Volver al Editor
                    </button>
                  </>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Icons */}
        <aside className="w-16 border-r border-editor-border bg-editor-panel flex flex-col items-center py-4 gap-6">
          <button className="p-2 text-editor-accent rounded-lg bg-blue-500/10"><Layout size={24} /></button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors"><Palette size={24} /></button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors"><Layers size={24} /></button>
          <div className="mt-auto">
            <button className="p-2 text-gray-400 hover:text-white transition-colors"><Settings size={24} /></button>
          </div>
        </aside>

        {/* Library Sidebar */}
        <aside className="w-64 border-r border-editor-border bg-[#252525] p-4 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
            Librería
            <button className="hover:text-white transition-colors"><PlusCircle size={16} /></button>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => addElement({
                id: `txt-${Date.now()}`, type: 'text', frameStart: currentFrame, durationInFrames: 120,
                x: 100, y: 100, width: 600, height: 120, scale: 1, rotation: 0, opacity: 1,
                properties: { text: 'NUEVO MENSAJE', fontSize: 60, color: '#ffffff' },
                animations: { entrance: { type: 'slide', durationInFrames: 30 } }
              })}
              className="bg-editor-panel border border-editor-border rounded-lg p-3 hover:border-editor-accent transition-all group flex flex-col items-center gap-2"
            >
               <div className="w-full h-1 bg-gray-500 group-hover:bg-editor-accent"></div>
               <span className="text-[10px] text-gray-400 group-hover:text-white font-bold uppercase tracking-tighter">Añadir Texto</span>
            </button>
            <button 
              onClick={() => addElement({
                id: `clm-${Date.now()}`, type: 'widget-clima', frameStart: currentFrame, durationInFrames: 300,
                x: 50, y: 50, width: 250, height: 250, scale: 1, rotation: 0, opacity: 1,
                properties: { city: 'Madrid' },
                animations: { entrance: { type: 'fade', durationInFrames: 60 } }
              })}
              className="bg-editor-panel border border-editor-border rounded-lg p-3 hover:border-editor-accent transition-all group flex flex-col items-center gap-2"
            >
               <span className="text-xl">☀️</span>
               <span className="text-[10px] text-gray-400 group-hover:text-white font-bold uppercase tracking-tighter">Añadir Clima</span>
            </button>
            <button 
              onClick={() => addElement({
                id: `rss-${Date.now()}`, type: 'widget-rss', frameStart: currentFrame, durationInFrames: 450,
                x: 0, y: height - 120, width, height: 120, scale: 1, rotation: 0, opacity: 1,
                properties: { rssText: 'Noticia importante del momento...' },
                animations: { entrance: { type: 'slide', durationInFrames: 30 } }
              })}
              className="bg-editor-panel border border-editor-border rounded-lg p-3 hover:border-editor-accent transition-all group flex flex-col items-center gap-2 col-span-2"
            >
               <div className="w-full h-4 bg-gray-800 rounded border border-editor-border relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-editor-accent/20"></div>
               </div>
               <span className="text-[10px] text-gray-400 group-hover:text-white font-bold uppercase tracking-tighter">Añadir Barra de Noticias (RSS)</span>
            </button>
          </div>
        </aside>

        {/* Central Canvas Area */}
        <main className="flex-1 bg-black p-8 flex flex-col items-center justify-center overflow-auto">
          <div className="w-full max-w-4xl shadow-2xl">
            <VideoPlayer />
          </div>
        </main>

        {/* Properties Sidebar */}
        <aside className="w-72 border-l border-editor-border bg-editor-panel flex flex-col">
          <div className="p-4 border-b border-editor-border bg-black/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <Monitor size={14} /> Orientación
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setResolution(1920, 1080)}
                className={`flex items-center justify-center gap-2 p-2 rounded border transition-all ${width === 1920 ? 'border-editor-accent bg-blue-500/10 text-editor-accent' : 'border-editor-border bg-editor-bg text-gray-400 hover:border-gray-500'}`}
              >
                <Monitor size={16} /> <span className="text-xs">16:9</span>
              </button>
              <button 
                onClick={() => setResolution(1080, 1920)}
                className={`flex items-center justify-center gap-2 p-2 rounded border transition-all ${height === 1920 ? 'border-editor-accent bg-blue-500/10 text-editor-accent' : 'border-editor-border bg-editor-bg text-gray-400 hover:border-gray-500'}`}
              >
                <Smartphone size={16} /> <span className="text-xs">9:16</span>
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
               <Palette size={14} /> Propiedades del Elemento
            </h3>
            {elements.length > 0 ? (
              <div className="flex flex-col gap-6">
                 {elements[elements.length - 1].type === 'text' && (
                   <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Texto</span>
                    <textarea
                      value={elements[elements.length - 1].properties.text}
                      onChange={(e) => updateElement(elements[elements.length - 1].id, { properties: { ...elements[elements.length - 1].properties, text: e.target.value } })}
                      className="w-full bg-editor-bg border border-editor-border rounded p-2 text-sm focus:border-editor-accent outline-none resize-none h-24 transition-all shadow-inner"
                    />
                  </label>
                 )}
                 <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase text-center">X (px)</span>
                      <input type="number" value={elements[elements.length-1].x} onChange={(e)=>updateElement(elements[elements.length-1].id, {x: Number(e.target.value)})} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-center outline-none focus:border-editor-accent"/>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase text-center">Y (px)</span>
                      <input type="number" value={elements[elements.length-1].y} onChange={(e)=>updateElement(elements[elements.length-1].id, {y: Number(e.target.value)})} className="bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-center outline-none focus:border-editor-accent"/>
                    </label>
                 </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic text-center mt-10">Selecciona un elemento en el timeline para editar sus propiedades</p>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Area - Timeline */}
      <footer className="h-64 border-t border-editor-border bg-editor-panel flex flex-col shadow-2xl">
        <div className="h-10 border-b border-editor-border flex items-center px-4 gap-4 text-xs text-gray-500 bg-[#222]">
           <span className="font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Línea de Tiempo</span>
           <div className="flex-1 flex justify-center items-center">
              <span className="font-mono text-editor-accent bg-black/40 px-4 py-1 rounded-full border border-editor-border shadow-inner text-sm">
                {formatTime(currentFrame)} / {formatTime(durationInFrames)}
              </span>
           </div>
           <span className="text-gray-600">FPS: {fps}</span>
        </div>
        <div className="flex-1 overflow-hidden">
           <Timeline />
        </div>
      </footer>
    </div>
  );
}

export default App;
