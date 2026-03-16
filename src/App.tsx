import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';

// 캐릭터들의 정보를 담고 있는 배열입니다.
// 새로운 캐릭터를 추가하거나 기존 캐릭터의 텍스트, 애니메이션, 크기 등을 여기서 수정할 수 있습니다.
const B = import.meta.env.BASE_URL;
const CHARACTERS = [
  {
    id: 0,
    name: 'Yuchung',
    role: '강점: 긍정',
    src: `${B}yuchung.png`, // 기본 상태의 이미지 경로
    poseSrc: `${B}yuchung_pose.png`, // 마우스를 올렸을 때(활성화 시) 보여줄 이미지 경로
    text: "어떤 상황에서도 가능성을 믿는 에너지 ✨", // 말풍선에 들어갈 텍스트
    baseScale: 0.8, // 기본 크기 비율 (1.0이 원본 크기)
    activeScale: 0.94, // 마우스를 올렸을 때 커지는 크기 비율
    stageReq: 2, // 이 캐릭터가 화면에 등장하기 위해 필요한 최소 stage 값 (클릭/박수 횟수)
    animation: { rotate: [0, -5, 5, -3, 3, 0] }, // 활성화 시 적용될 애니메이션 (여기서는 좌우로 흔들림)
    emojis: ['☀️', '😊', '✨', '💛'], // 캐릭터 클릭 시 튀어오르는 파티클 이모지들
    color: 'from-pink-300 to-rose-300', // 말풍선 텍스트와 바닥 조명에 사용될 그라데이션 색상
    className: 'translate-y-[4%] -translate-x-8 md:-translate-x-16' // 유청이를 왼쪽으로 이동
  },
  {
    id: 1,
    name: 'Soyoon',
    role: '강점: 끈기',
    src: `${B}soyoon.png`,
    poseSrc: `${B}soyoon_pose.png`,
    text: "포기하지 않고 끝까지 밀어붙이는 추진력 🔥",
    baseScale: 0.80,
    activeScale: 0.93,
    stageReq: 1,
    animation: { y: [0, -15, 0, -10, 0] },
    emojis: ['🔥', '💪', '🏃‍♀️', '✨'],
    color: 'from-blue-300 to-cyan-300',
    className: 'translate-y-[6%] translate-x-0' // 소윤이를 중앙에 배치
  },
  {
    id: 2,
    name: 'Taehyun',
    role: '강점: 실행력',
    src: `${B}taehyun.png`,
    poseSrc: `${B}taehyun_pose.png`,
    text: "상상을 실제 결과물로 전환하는 행동력 🚀",
    baseScale: 0.90, // 사이즈 조금 키움
    activeScale: 1.03,
    stageReq: 3,
    animation: { x: [0, -10, 10, -10, 10, 0], y: [0, -15, 0] },
    emojis: ['🚀', '⚡', '🛠️', '🔥'],
    color: 'from-purple-300 to-indigo-300',
    className: 'translate-y-[0%] -translate-x-18 md:-translate-x-36', // 태현이를 왼쪽으로 이동
    bubbleClassName: 'ml-[20%]'
  }
];

const Particles = ({ emojis }: { emojis: string[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 300,
            y: -100 - Math.random() * 200,
            scale: 1.5 + Math.random(),
            rotate: Math.random() * 360
          }}
          transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
          className="absolute text-4xl"
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </div>
  );
};

// 개별 캐릭터와 그에 딸린 효과(조명, 말풍선, 파티클)를 렌더링하는 컴포넌트입니다.
const CharacterCard = ({ char, isActive, onActivate, onDeactivate }: any) => {
  const [imgSrc, setImgSrc] = useState(char.src);
  const [isClicked, setIsClicked] = useState(false); // 클릭 시 파티클 효과를 트리거하기 위한 상태

  useEffect(() => {
    // 마우스를 올렸을 때 이미지가 깜빡이는 현상을 막기 위해, poseSrc 이미지를 미리 로드(Preload)합니다.
    if (isActive && char.poseSrc) {
      const img = new Image();
      img.src = char.poseSrc;
      img.onload = () => setImgSrc(char.poseSrc);
      img.onerror = () => setImgSrc(char.src); // 이미지 로드 실패 시 기본 이미지 유지
    } else {
      setImgSrc(char.src);
    }
  }, [isActive, char.src, char.poseSrc]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering background click
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ 
        y: isClicked ? -80 : 0, 
        opacity: 1,
        zIndex: isActive ? 50 : 20,
        ...(isActive && !isClicked ? char.animation : { rotate: 0, x: 0 })
      }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ 
        y: (isActive && !isClicked && char.animation.y) 
          ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } 
          : { type: "spring", stiffness: 300, damping: 15 },
        opacity: { duration: 0.3 },
        default: { duration: isActive ? 1.5 : 0.5, repeat: isActive && !isClicked ? Infinity : 0, ease: "easeInOut" }
      }}
      // 캐릭터 전체를 감싸는 컨테이너입니다.
      // 💡 중요: max-h-[700px] 값을 수정하면 캐릭터가 화면에서 커질 수 있는 최대 높이를 제한할 수 있습니다.
      // (예: max-h-[500px]로 줄이면 캐릭터가 더 이상 커지지 않음, max-h-[1000px]로 늘리면 화면에 꽉 차게 커짐)
      className={`relative w-1/3 h-full max-h-[700px] flex justify-center items-end origin-bottom pointer-events-none ${char.className || ''}`}
    >
      {/* Spotlight Floor Glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 rounded-[100%] blur-xl bg-gradient-to-r ${char.color} opacity-60 -z-10`}
          />
        )}
      </AnimatePresence>

      {/* Particles on Click */}
      {isClicked && <Particles emojis={char.emojis} />}

      {/* Speech Bubble */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className={`absolute top-[35%] left-1/2 -translate-x-1/2 w-72 bg-white/10 backdrop-blur-md p-5 rounded-3xl shadow-[0_8px_32px_rgba(255,255,255,0.15)] z-50 pointer-events-none border border-white/30 ${char.bubbleClassName || ''}`}
          >
            <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${char.color} mb-2 text-xl drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]`}>
              {char.role}
            </div>
            <div className="text-base whitespace-pre-line leading-relaxed font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {char.text}
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white/10 backdrop-blur-md border-b border-r border-white/30 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img 
        src={imgSrc} 
        alt={char.name}
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        onClick={handleClick}
        animate={{
          scale: isActive ? char.activeScale : char.baseScale,
          filter: isActive 
            ? 'drop-shadow(0px 0px 30px rgba(255,255,255,0.8))' 
            : 'drop-shadow(0px 0px 10px rgba(255,255,255,0.3))',
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-full max-h-full w-auto h-auto object-contain object-bottom origin-bottom hover:brightness-110 pointer-events-auto cursor-pointer"
        style={{ WebkitUserDrag: 'none' }}
      />
    </motion.div>
  );
};

export default function App() {
  // stage: 화면을 클릭하거나 박수를 칠 때마다 올라가는 단계 (0: 빈 무대, 1: 소윤 등장, 2: 유청 등장, 3: 태현 등장)
  const [stage, setStage] = useState(0);
  // activeChar: 현재 마우스가 올라가 있는 캐릭터의 ID (없으면 null)
  const [activeChar, setActiveChar] = useState<number | null>(null);
  // isListening: 마이크 소리(박수) 감지 기능이 켜져 있는지 여부
  const [isListening, setIsListening] = useState(false);
  // storyPhase: 마우스 휠을 굴렸을 때 진행되는 스토리 씬 단계 (0: 기본, 1~3: 날아가는 연출, 4: 마지막 교실 씬)
  const [storyPhase, setStoryPhase] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>();
  const lastClapTimeRef = useRef<number>(0);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  const handleNextStage = () => {
    if (storyPhase > 0) return;
    setStage((prev) => Math.min(prev + 1, 3));
  };

  const toggleListening = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isListening) {
      // Stop listening
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) await audioContextRef.current.close();
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectClap = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteTimeDomainData(dataArray);
        let max = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = Math.abs(dataArray[i] - 128);
          if (val > max) max = val;
        }

        // Clap threshold (adjust sensitivity if needed)
        if (max > 40 && Date.now() - lastClapTimeRef.current > 800) {
          lastClapTimeRef.current = Date.now();
          setStage((prev) => Math.min(prev + 1, 3));
        }

        requestRef.current = requestAnimationFrame(detectClap);
      };

      detectClap();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("마이크 권한이 필요합니다.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleNextStage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [storyPhase]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // 배경음악: 캐릭터가 모두 등장하면(stage === 3) 재생
  useEffect(() => {
    if (stage === 3) {
      if (!bgMusicRef.current) {
        bgMusicRef.current = new Audio(`${B}Imagination_Spark.mp3`);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.5;
      }
      bgMusicRef.current.play().catch(() => {});
    } else {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    }
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, [stage]);

  // Scroll interaction for story progression
  useEffect(() => {
    if (stage < 3) return;
    
    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      if (Math.abs(e.deltaY) < 30) return;

      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 1500);

      if (e.deltaY > 0) {
        setStoryPhase(prev => {
          if (prev === 0) setActiveChar(null);
          return Math.min(prev + 1, 4);
        });
      } else if (e.deltaY < 0) {
        setStoryPhase(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [stage]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-sky-900 flex items-center justify-center select-none cursor-pointer"
      onClick={handleNextStage}
    >
      {/* Sky Base Background (Always behind) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-300 via-blue-200 to-white z-0" />

      {/* Moving Clouds */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        animate={{
          y: storyPhase === 0 ? "0%" : (storyPhase === 1 ? "-30%" : "-60%")
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="absolute top-[20%] left-[10%] w-64 h-24 bg-white rounded-full blur-2xl" />
        <div className="absolute top-[40%] right-[20%] w-96 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute top-[70%] left-[30%] w-72 h-24 bg-white rounded-full blur-2xl" />
        <div className="absolute top-[90%] right-[10%] w-80 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute top-[120%] left-[20%] w-96 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute top-[150%] right-[30%] w-80 h-24 bg-white rounded-full blur-2xl" />
      </motion.div>

      {/* Original Background Image */}
      <motion.div 
        className={`absolute inset-0 w-full h-full bg-cover bg-bottom bg-no-repeat z-0 transition-all duration-1000 ${activeChar !== null || storyPhase > 0 ? 'brightness-75' : 'brightness-100'}`}
        style={{ backgroundImage: `url('${B}background.png')` }}
        animate={{
          y: storyPhase === 0 ? "0%" : (storyPhase === 1 ? "-50%" : "-100%"),
          opacity: storyPhase > 1 ? 0 : 1
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Dreamy Soft Overlay */}
      <div className={`absolute inset-0 bg-sky-900/20 backdrop-blur-[4px] transition-all duration-1000 pointer-events-none z-0 ${activeChar !== null || storyPhase > 0 ? 'opacity-100' : 'opacity-0'}`} />

      {/* The Magical Door */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-[28rem] bg-white/30 backdrop-blur-md border-x-8 border-t-8 border-white/60 rounded-t-full shadow-[0_0_100px_rgba(255,255,255,1)] flex items-center justify-center z-0 origin-bottom"
        initial={{ y: "100%", opacity: 0, scale: 0.5 }}
        animate={{
          y: storyPhase < 2 ? "100%" : (storyPhase === 2 ? "10%" : "0%"),
          opacity: storyPhase < 2 ? 0 : 1,
          scale: storyPhase < 2 ? 0.5 : (storyPhase === 2 ? 0.9 : 1.2),
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-t-full bg-gradient-to-t from-white via-white/90 to-transparent animate-pulse flex items-center justify-center">
          <div className="w-full h-full rounded-t-full shadow-[inset_0_0_50px_rgba(255,255,255,1)]" />
        </div>
      </motion.div>
      
      {/* Whiteout transition for phase 3 */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: storyPhase === 3 ? 1 : 0 }}
        transition={{ duration: 1.5, delay: storyPhase === 3 ? 0.8 : 0 }}
      />

      {/* Instructions Removed */}

      {/* Mic Toggle Button */}
      <AnimatePresence>
        {storyPhase === 0 && (
          <motion.button
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleListening}
            className={`absolute top-8 right-8 z-50 p-4 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
              isListening 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-black/40 border-white/20 text-white/70 hover:bg-black/60 hover:text-white'
            }`}
          >
            {isListening ? (
              <Mic className="w-6 h-6 animate-pulse" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stage Area (The Magic Carpet) */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-10"
        animate={{
          y: storyPhase === 0 ? 0 : (storyPhase === 1 ? -30 : (storyPhase === 2 ? -60 : 250)),
          scale: storyPhase === 0 ? 1 : (storyPhase === 1 ? 0.9 : (storyPhase === 2 ? 0.8 : 0.2)),
          opacity: storyPhase === 3 ? 0 : 1,
        }}
        transition={{ 
          duration: storyPhase === 3 ? 1.5 : 2, 
          ease: "easeInOut" 
        }}
      >
        <motion.div
          animate={{ 
            y: storyPhase > 0 ? [0, -40, 0] : 0,
            rotate: storyPhase > 0 ? [0, 2, -2, 0] : 0
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          {/* Magic Carpet Base */}
          <motion.div 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex justify-center items-end"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="relative flex-shrink-0"
              style={{
                width: 'max(100vw, 100vh * (6000 / 3348))',
                height: 'max(100vh, 100vw * (3348 / 6000))'
              }}
            >
              {/* 무대 이미지 (stage.png) */}
              <motion.img 
                src={`${B}stage.png`}
                alt="Magic Stage" 
                className="absolute"
                // 💡 중요: 무대의 위치와 크기를 결정합니다.
                // left, top, width, height 값을 조정하여 화면 내 무대 크기를 바꿀 수 있습니다.
                style={{
                  left: '0%',
                  top: '0%',
                  width: '100%',
                  height: '100%'
                }}
                animate={{
                  filter: activeChar !== null && storyPhase === 0
                    ? [
                        "drop-shadow(0 20px 50px rgba(255,255,255,0.5)) brightness(1)", 
                        "drop-shadow(0 20px 80px rgba(125,211,252,0.8)) brightness(1.15)", 
                        "drop-shadow(0 20px 50px rgba(255,255,255,0.5)) brightness(1)"
                      ]
                    : "drop-shadow(0 20px 50px rgba(255,255,255,0.5)) brightness(1)"
                }}
                transition={{ duration: 2, repeat: activeChar !== null && storyPhase === 0 ? Infinity : 0, ease: "easeInOut" }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* 캐릭터들이 배치되는 투명한 컨테이너 */}
              <div 
                className="absolute flex justify-center items-end -space-x-[15%] md:-space-x-[25%] px-4 pointer-events-auto z-30"
                // 💡 중요: 이 컨테이너는 바로 위 무대(stage.png)와 동일한 left, top, width, height를 가져야 합니다.
                // 그래야 캐릭터들이 무대 위에 정확히 서 있게 됩니다.
                style={{
                  left: '0%',
                  top: '0%',
                  width: '100%',
                  height: '100%',
                  paddingBottom: '15%' // 캐릭터의 발끝이 무대 바닥에 닿도록 하단 여백을 줍니다.
                }}
              >
                <AnimatePresence>
                  {CHARACTERS.map((char) => (
                    stage >= char.stageReq && (
                      <CharacterCard
                        key={char.id}
                        char={char}
                        isActive={activeChar === char.id && storyPhase === 0}
                        onActivate={() => { if (storyPhase === 0) setActiveChar(char.id); }}
                        onDeactivate={() => setActiveChar(null)}
                      />
                    )
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Active Character Ripple Effect on Stage */}
          <AnimatePresence>
            {activeChar !== null && storyPhase === 0 && (
              <motion.div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[70%] max-w-4xl h-24 border-2 border-sky-300/60 rounded-[100%] pointer-events-none z-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.6, 0], 
                  scale: [0.8, 1.1, 1.3] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
              />
            )}
          </AnimatePresence>

          {/* Magic Carpet Glow */}
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] max-w-5xl h-24 bg-white/20 rounded-[100%] blur-2xl pointer-events-none"
            animate={{
              opacity: storyPhase > 0 ? 1 : 0,
              scale: storyPhase > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          />

          {/* Floating Car (Appears with Yuchung) */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.img
                src={`${B}car.png`}
                alt="Car"
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  y: [0, -20, 0] 
                }}
                exit={{ opacity: 0, x: -50, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.8 },
                  x: { duration: 0.8, type: "spring" },
                  scale: { duration: 0.8, type: "spring" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="absolute left-[-15%] md:left-[-5%] bottom-[5%] md:bottom-[5%] w-[240vw] md:w-[120vw] max-w-[1800px] min-w-[600px] object-contain z-20 pointer-events-none drop-shadow-2xl"
              />
            )}
          </AnimatePresence>

          {/* Floating Bread (Appears with Soyoon) */}
          <AnimatePresence>
            {stage >= 2 && (
              <motion.img
                src={`${B}bread.png`}
                alt="Bread"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -15, 0],
                  scale: 1,
                  rotate: [0, -5, 0]
                }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.8 },
                  scale: { duration: 0.8, type: "spring" },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute left-[-10%] md:left-[0%] bottom-[-10%] md:bottom-[-10%] w-[240vw] md:w-[120vw] max-w-[1800px] min-w-[600px] object-contain z-30 pointer-events-none drop-shadow-2xl"
              />
            )}
          </AnimatePresence>

          {/* Floating Basketball (Appears with Taehyun) */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.img
                src={`${B}basketball.png`}
                alt="Basketball"
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  y: [0, -25, 0],
                  rotate: [0, 10, 0]
                }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.8 },
                  x: { duration: 0.8, type: "spring" },
                  scale: { duration: 0.8, type: "spring" },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                  rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute right-[-10%] md:right-[0%] bottom-[12%] md:bottom-[12%] w-[240vw] md:w-[120vw] max-w-[1800px] min-w-[600px] object-contain z-20 pointer-events-none drop-shadow-2xl"
              />
            )}
          </AnimatePresence>

          {/* Characters Container (Moved inside Magic Carpet Base) */}
        </motion.div>
      </motion.div>

      {/* Final Classroom Scene */}
      <AnimatePresence>
        {storyPhase === 4 && (
          <motion.div
            className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white overflow-hidden"
            initial={{ opacity: 0, scale: 1, filter: 'blur(0px)' }}
            animate={{ 
              opacity: isRedirecting ? 0 : 1, 
              scale: isRedirecting ? 1.5 : 1,
              filter: isRedirecting ? 'blur(20px)' : 'blur(0px)'
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Classroom Image Background */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${B}classroom.png')` }}
            />
            
            {/* Clickable Hotspot for the White Screen */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[60%] h-[45%] md:w-[50%] md:h-[50%] z-10 cursor-pointer group"
              onClick={() => { 
                if (isRedirecting) return;
                setIsRedirecting(true);
                setTimeout(() => {
                  window.location.href = 'https://github.com/users/FancyYc/projects/4/views/1';
                }, 1500);
              }}
            >
              {/* Hover effect to indicate it's clickable */}
              <div className="w-full h-full rounded-lg transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
            </div>
            
            {/* Loading Spinner during redirect */}
            <AnimatePresence>
              {isRedirecting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex items-center justify-center"
                >
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin drop-shadow-lg" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
