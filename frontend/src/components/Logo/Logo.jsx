const Logo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-primary font-display font-bold text-3xl">
        CREDIT
      </span>
      <span className="text-dark font-display font-bold text-3xl">JAMBO</span>
    </div>
  )
}

export default Logo
