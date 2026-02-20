
export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Circle 1 - Top Left - Teal */}
      <div 
        className="absolute w-80 h-80 rounded-full animate-float-slow"
        style={{
          top: '5%',
          left: '2%',
          backgroundColor: 'rgba(20, 184, 166, 0.15)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Square 1 - Top Right - Orange */}
      <div 
        className="absolute w-64 h-64 rounded-3xl animate-float-medium"
        style={{
          top: '15%',
          right: '5%',
          backgroundColor: 'rgba(251, 146, 60, 0.12)',
          filter: 'blur(50px)',
          transform: 'rotate(15deg)',
        }}
      />
      
      {/* Circle 2 - Middle Left - Pink */}
      <div 
        className="absolute w-96 h-96 rounded-full animate-float-fast"
        style={{
          top: '40%',
          left: '5%',
          backgroundColor: 'rgba(236, 72, 153, 0.12)',
          filter: 'blur(70px)',
        }}
      />
      
      {/* Circle - Bottom Right - Emerald */}
      <div 
        className="absolute w-72 h-72 rounded-full animate-float-slow"
        style={{
          bottom: '10%',
          right: '10%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          filter: 'blur(55px)',
        }}
      />
      
      {/* Small Circle - Bottom Left - Amber */}
      <div 
        className="absolute w-56 h-56 rounded-full animate-float-medium"
        style={{
          bottom: '20%',
          left: '10%',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          filter: 'blur(45px)',
        }}
      />
      
      {/* Rectangle - Middle Right - Rose */}
      <div 
        className="absolute w-64 h-48 rounded-2xl animate-float-fast"
        style={{
          top: '55%',
          right: '3%',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          filter: 'blur(50px)',
          transform: 'rotate(-10deg)',
        }}
      />
    </div>
  );
}
