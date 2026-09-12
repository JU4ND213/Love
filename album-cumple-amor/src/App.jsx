import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Music, Pause, Play, Sparkles, SkipForward, X, ArrowLeft, ArrowRight, Star } from 'lucide-react';

const playlist = [
  '/music/Justin Bieber - All Around The World (Lyric Video) ft. Ludacris - JustinBieberVEVO.mp3',
  '/music/Outlander  Season 1.mp3',
  '/music/Zoé - Luna (MTV Unplugged) - ZoeVEVO.mp3',
  '/music/Zoé - Soñé (MTV Unplugged) - ZoeVEVO.mp3'
];

const CuadroGaleria = ({ titulo, nota, index, carpeta, onZoom }) => {
  const [fotos, setFotos] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      let modulos;
      if (carpeta === 'cuadro1') {
        modulos = import.meta.glob('/public/images/cuadro1/*.{jpeg,jpg,png,webp}');
      } else if (carpeta === 'cuadro2') {
        modulos = import.meta.glob('/public/images/cuadro2/*.{jpeg,jpg,png,webp}');
      } else if (carpeta === 'cuadro3') {
        modulos = import.meta.glob('/public/images/cuadro3/*.{jpeg,jpg,png,webp}');
      }

      const imagePaths = Object.keys(modulos).map(path => path.replace('/public', ''));
      setFotos(imagePaths);
    };
    loadImages();
  }, [carpeta]);

  const nextFoto = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % fotos.length);
  };
  
  const prevFoto = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  if (fotos.length === 0) return <p className="text-pink-300 italic">Cargando memorias...</p>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-white p-5 pb-7 rounded-xl shadow-sm border border-pink-50"
    >
      <div 
        className="relative group overflow-hidden rounded-lg mb-5 bg-pink-50 cursor-pointer"
        onClick={() => onZoom({ fotos, index: current })}
      >
        <img 
          src={fotos[current]} 
          alt={`Recuerdo ${current + 1}`} 
          loading="lazy"
          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Pliegue Anterior (Esquina Inferior Izquierda) */}
        <div onClick={prevFoto} className="absolute bottom-0 left-0 w-12 h-12 cursor-pointer group/prev z-20">
          <div className="absolute bottom-0 left-0 w-full h-full bg-white/95 backdrop-blur-sm shadow-[3px_-3px_10px_rgba(244,114,182,0.3)] transition-all duration-300 group-hover/prev:w-16 group-hover/prev:h-16" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
          <ArrowLeft size={16} className="absolute bottom-1.5 left-1.5 text-pink-300 transform rotate-45 group-hover/prev:-translate-x-1 group-hover/prev:-translate-y-1 transition-transform" />
        </div>

        {/* Pliegue Siguiente (Esquina Inferior Derecha) */}
        <div onClick={nextFoto} className="absolute bottom-0 right-0 w-12 h-12 cursor-pointer group/next z-20">
          <div className="absolute bottom-0 right-0 w-full h-full bg-white/95 backdrop-blur-sm shadow-[-3px_-3px_10px_rgba(244,114,182,0.3)] transition-all duration-300 group-hover/next:w-16 group-hover/next:h-16" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
          <ArrowRight size={16} className="absolute bottom-1.5 right-1.5 text-pink-300 transform -rotate-45 group-hover/next:translate-x-1 group-hover/next:-translate-y-1 transition-transform" />
        </div>

        {/* Contador arriba para no tapar los pliegues */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-pink-300 text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase shadow-sm">
          {current + 1} / {fotos.length}
        </div>
      </div>
      <p className="text-lg font-bold text-pink-300 uppercase tracking-widest">{titulo}</p>
      <p className="text-gray-400 italic text-sm mt-1">{nota}</p>
    </motion.div>
  );
};

// Contraportada: collage de fotos en forma de luna
const MoonCollage = ({ fotos }) => {
  if (!fotos || fotos.length === 0) return null;

  // Mapa EXTREMADAMENTE PRECISO basado en la imagen de referencia (7 columnas x 10 filas)
const moonLayout = [
  // Punta superior
  { c: 6, r: 1, cs: 1, rs: 1 }, // Cuadro pequeño superior
  { c: 4, r: 2, cs: 2, rs: 2 }, // Cuadro grande oscuro superior
  
  // Curva superior e interior
  { c: 2, r: 3, cs: 2, rs: 2 }, // Cuadro grande claro (izq)
  { c: 4, r: 4, cs: 2, rs: 2 }, // Cuadro grande claro (der, bajo el oscuro)
  { c: 3, r: 5, cs: 1, rs: 1 }, // Conector pequeño
  
  // Vientre (la parte más gruesa a la izquierda)
  { c: 1, r: 5, cs: 2, rs: 2 }, // Cuadro grande oscuro (el más a la izquierda)
  { c: 3, r: 6, cs: 2, rs: 2 }, // Cuadro grande oscuro central
  { c: 6, r: 6, cs: 1, rs: 1 }, // Cuadro pequeño flotante interno
  
  // Curva inferior
  { c: 4, r: 8, cs: 1, rs: 1 }, // Conector pequeño
  { c: 2, r: 8, cs: 2, rs: 2 }, // Cuadro grande oscuro inferior-izq
  
  // Base de la luna
  { c: 6, r: 9, cs: 1, rs: 1 }, // Conector pequeño
  { c: 4, r: 9, cs: 2, rs: 2 }, // Cuadro grande claro inferior
  { c: 3, r: 10, cs: 1, rs: 1 }, // Conector pequeño
  { c: 6, r: 10, cs: 2, rs: 2 }, // Cuadro grande oscuro inferior-der
  { c: 8, r: 11, cs: 1, rs: 1 }  // Cuadro pequeño de la punta inferior
];

  return (
    <section className="mt-32 pt-20 border-t border-pink-100 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative overflow-hidden">
      
      {/* Contenedor de la luna */}
      <div className="relative">
        {/* Estrellas decorativas mapeadas a la referencia */}
        <Star className="absolute -top-6 -left-6 text-yellow-400 animate-pulse" size={24} fill="currentColor" />
        <Star className="absolute -top-2 -right-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0.7s' }} size={28} fill="currentColor" />
        <Star className="absolute bottom-16 -left-10 text-yellow-400 animate-pulse" style={{ animationDelay: '1.2s' }} size={22} fill="currentColor" />
        <Star className="absolute bottom-10 -right-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.4s' }} size={26} fill="currentColor" />
        
        {/* EL TRUCO: aspect-ratio bloqueado para que sean CUADRADOS PERFECTOS */}
              <div 
  className="grid gap-1 w-[280px] md:w-[340px]" 
  style={{ 
    gridTemplateColumns: 'repeat(8, 1fr)', 
    gridTemplateRows: 'repeat(11, 1fr)',
    aspectRatio: '8 / 11' // Mantiene los cuadrados perfectos
  }}
>
          {moonLayout.map((block, i) => (
            <div 
              key={i} 
              className="bg-pink-100 overflow-hidden shadow-sm"
              style={{ 
                gridColumn: `${block.c} / span ${block.cs}`, 
                gridRow: `${block.r} / span ${block.rs}` 
              }}
            >
              <img 
                src={fotos[i % fotos.length]} 
                alt="Fragmento de la luna" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null); 
  const [portadaUrl, setPortadaUrl] = useState('');
  const [todasLasFotos, setTodasLasFotos] = useState([]); 
  
  const [isRevealed, setIsRevealed] = useState(false); 
  const audioRef = useRef(null);

  const babyPinkStroke = '-1px -1px 0 #f9a8d4, 1px -1px 0 #f9a8d4, -1px 1px 0 #f9a8d4, 1px 1px 0 #f9a8d4, 0px 4px 15px rgba(249,168,212,0.6)';

  const cuadrosInfo = [
    { id: 1, titulo: 'Nuestros Inicios', nota: 'Como empezó esta hermosa historia...', carpeta: 'cuadro1' },
    { id: 2, titulo: 'Nuestras Saliditas', nota: 'Conociendo y reconociendo nuevos lugares', carpeta: 'cuadro2' },
    { id: 3, titulo: 'Momentos Divertidos', nota: 'Risas que me dan vida y días perfectos.', carpeta: 'cuadro3' },
  ];

  useEffect(() => {
    const modulosPortada = import.meta.glob('/public/images/portada/*.{jpeg,jpg,png,webp}');
    const paths = Object.keys(modulosPortada);
    if (paths.length > 0) {
      setPortadaUrl(paths[0].replace('/public', ''));
    }
  }, []);

  useEffect(() => {
    const modulosTodasLasFotos = import.meta.glob('/public/images/cuadro*/*.{jpeg,jpg,png,webp}');
    const pathsTodasLasFotos = Object.keys(modulosTodasLasFotos).map(path => path.replace('/public', ''));
    setTodasLasFotos(pathsTodasLasFotos);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(nextIndex);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  const lanzarConfeti = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#d96daa', '#d87aaf', '#8a4646'] });
  };

  const nextLightboxFoto = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.fotos.length }));
  };
  const prevLightboxFoto = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({ ...prev, index: (prev.index === 0 ? prev.fotos.length - 1 : prev.index - 1) }));
  };

  return (
    <div className="h-screen w-full bg-[#FCF9F9] text-gray-700 font-serif selection:bg-pink-100 overflow-hidden relative">
      <audio ref={audioRef} src={playlist[currentSongIndex]} onEnded={nextSong} />

      <AnimatePresence>
        {isRevealed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setIsRevealed(false)}
            className="fixed top-0 left-0 w-24 h-24 md:w-32 md:h-32 cursor-pointer group z-50"
          >
            <div 
              className="absolute top-0 left-0 w-full h-full bg-white/90 backdrop-blur-md shadow-[5px_5px_15px_rgba(244,114,182,0.2)] transition-all duration-300 group-hover:w-28 group-hover:h-28 md:group-hover:w-36 md:group-hover:h-36"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            ></div>
            <ArrowLeft size={24} className="absolute top-4 left-4 text-pink-400 transform rotate-45 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button onClick={toggleMusic} className="bg-white/80 backdrop-blur-md p-3.5 rounded-full shadow-sm border border-pink-50 hover:bg-white transition text-pink-300 flex items-center gap-2">
          {isPlaying ? <Pause size={18} strokeWidth={2} /> : <Play size={18} strokeWidth={2} />}
          <Music size={18} strokeWidth={2} />
        </button>
        <button onClick={nextSong} className="bg-white/80 backdrop-blur-md p-3.5 rounded-full shadow-sm border border-pink-50 hover:bg-white transition text-pink-300 flex items-center">
          <SkipForward size={18} strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/95 p-4 md:p-10 group"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-pink-300 bg-pink-50 p-3 rounded-full hover:bg-pink-100 transition shadow-sm z-10">
              <X size={24} />
            </button>

            <div onClick={prevLightboxFoto} className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 cursor-pointer group/prev z-50">
              <div className="absolute bottom-0 left-0 w-full h-full bg-pink-50/95 backdrop-blur-md shadow-[5px_-5px_15px_rgba(244,114,182,0.3)] transition-all duration-300 group-hover/prev:w-28 group-hover/prev:h-28 md:group-hover/prev:w-36 md:group-hover/prev:h-36" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
              <ArrowLeft size={32} className="absolute bottom-4 left-4 text-pink-400 transform rotate-45 group-hover/prev:-translate-x-1 group-hover/prev:-translate-y-1 transition-transform" />
            </div>

            <AnimatePresence mode="wait">
              <motion.img 
                key={lightbox.index} 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                src={lightbox.fotos[lightbox.index]} 
                alt="Zoom" 
                className="max-w-full max-h-[90vh] object-contain rounded-md shadow-sm"
                onClick={(e) => e.stopPropagation()} 
              />
            </AnimatePresence>

            <div onClick={nextLightboxFoto} className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 cursor-pointer group/next z-50">
              <div className="absolute bottom-0 right-0 w-full h-full bg-pink-50/95 backdrop-blur-md shadow-[-5px_-5px_15px_rgba(244,114,182,0.3)] transition-all duration-300 group-hover/next:w-28 group-hover/next:h-28 md:group-hover/next:w-36 md:group-hover/next:h-36" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
              <ArrowRight size={32} className="absolute bottom-4 right-4 text-pink-400 transform -rotate-45 group-hover/next:translate-x-1 group-hover/next:-translate-y-1 transition-transform" />
            </div>
            
            <div className="absolute top-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-pink-300 text-xs font-sans tracking-widest font-bold shadow-sm border border-pink-50">
               {lightbox.index + 1} / {lightbox.fotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`absolute inset-0 w-full h-full ${!isRevealed ? 'z-40' : 'z-0 pointer-events-none'}`} 
        style={{ perspective: "2500px" }}
      >
        <AnimatePresence>
          {!isRevealed && (
            <motion.header 
              style={{ originX: 0 }} 
              initial={{ rotateY: -110, opacity: 0 }} 
              animate={{ rotateY: 0, opacity: 1 }}    
              exit={{ rotateY: -120, opacity: 0 }}    
              transition={{ duration: 1.5, ease: [0.77, 0, 0.17, 1] }} 
              className="absolute inset-0 z-40 w-full h-full flex flex-col items-center justify-between overflow-hidden bg-white pb-8 pt-20 md:pt-28 pointer-events-auto"
            >
              <div className="absolute inset-0 z-0">
                {portadaUrl && (
                  <img 
                    src={portadaUrl} 
                    alt="Portada" 
                    className="w-full h-full object-cover object-center md:object-[center_80%]"
                  />
                )}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="z-10 text-center w-full px-6 flex flex-col h-full justify-between pointer-events-none"
              >
                <div className="mt-2">
                  <p 
                    className="text-white text-xs md:text-sm tracking-[0.4em] uppercase font-sans font-bold mb-4"
                    style={{ textShadow: babyPinkStroke }}
                  >
                    Edición Especial Cumpleaños
                  </p>
                  <div className="w-12 h-[2px] bg-white mx-auto mb-6 opacity-90 shadow-sm"></div>
                  <h1 
                    className="text-[6rem] md:text-[12rem] font-bold text-white leading-none tracking-tighter" 
                    style={{ textShadow: babyPinkStroke }}
                  >
                    Amor
                  </h1>
                  <p 
                    className="text-white text-2xl md:text-3xl font-light italic mt-2"
                    style={{ textShadow: babyPinkStroke }}
                  >
                    Dominita de mi corazón
                  </p>
                </div>

                <div className="max-w-xl mx-auto w-full mb-2">
                  <div 
                    className="flex justify-between text-white font-sans text-[9px] md:text-xs uppercase tracking-widest font-bold mb-6"
                    style={{ textShadow: babyPinkStroke }}
                  >
                    <span>Te amoooo</span>
                    <span>19/09/2026</span>
                  </div>
                </div>
              </motion.div>

              <div 
                onClick={() => setIsRevealed(true)}
                className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 cursor-pointer group z-50 pointer-events-auto"
              >
                <div 
                  className="absolute bottom-0 right-0 w-full h-full bg-white/90 backdrop-blur-md shadow-[-10px_-10px_20px_rgba(244,114,182,0.3)] transition-all duration-500 group-hover:w-36 group-hover:h-36 md:group-hover:w-48 md:group-hover:h-48"
                  style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                ></div>
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end">
                   <span className="text-pink-400 font-sans text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 transform -rotate-45 translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Abrir
                   </span>
                   <ArrowRight size={28} className="text-pink-400 transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      </div>

      <div className={`absolute inset-0 z-10 w-full h-full bg-[#FCF9F9] ${isRevealed ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <main className="max-w-6xl mx-auto px-6 py-24 pb-32">
          <div className="text-center mb-16">
            <p className="text-pink-300 font-sans uppercase tracking-[0.3em] text-xs font-medium mb-3">Nuestra Historia</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700">Fragmentos de Vida</h2>
            <div className="w-16 h-[1px] bg-pink-200 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {cuadrosInfo.map((cuadro, index) => (
              <CuadroGaleria 
                key={cuadro.id} 
                index={index} 
                titulo={cuadro.titulo} 
                nota={cuadro.nota} 
                carpeta={cuadro.carpeta} 
                onZoom={setLightbox} 
              />
            ))}
          </div>

          <section className="mt-32 text-center bg-white p-10 md:p-16 shadow-sm border border-pink-50 max-w-3xl mx-auto relative overflow-hidden rounded-2xl">
            <div className="absolute -top-10 -right-10 text-pink-50 opacity-40">
               <Heart size={200} fill="currentColor" />
            </div>
            
            <Heart className="text-pink-200 mx-auto mb-6 relative z-10" size={40} fill="currentColor" />
            <h3 className="text-3xl font-bold text-gray-700 mb-6 relative z-10">Un mensaje para ti</h3>
            <p className="text-gray-500 leading-relaxed mb-10 text-lg relative z-10 font-light">
              Cada momento a tu lado es maravilloso y me encanta que sea así. Hoy en tu día especial me encanta ser parte del mismo y poderte acompañar con mucho amor, ¡vamos por este y más cumpleaños! Dios te bendiga mi amor, vas a cumplir todo lo que te propongas porque eres una mujer muy sorprendente. Día a día me enamoro más de ti y de cada una de tus cualidades, ¡me encantas y feliz cumpleaños, mi vida hermosa!
            </p>
            <button 
              onClick={lanzarConfeti} 
              className="bg-pink-300 text-white font-sans px-8 py-4 uppercase tracking-[0.15em] text-xs font-bold hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400/30 transition-all duration-300 transform active:scale-95 flex items-center gap-3 mx-auto relative z-10 rounded-full"            
            >
              <Sparkles size={18} /> Sorpresa
            </button>
          </section>

          {/* Contraportada: collage en forma de luna */}
          <MoonCollage fotos={todasLasFotos} />

        </main>
      </div>
    </div>
  );
}