import Logo from "../../components/Logo/Logo"

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-jambo-gray to-green-50">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-jambo-dark hover:text-jambo-green transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-jambo-dark hover:text-jambo-green transition-colors"
            >
              About
            </a>
            <a
              href="#products"
              className="text-jambo-dark hover:text-jambo-green transition-colors"
            >
              Products
            </a>
            <a
              href="#contact"
              className="text-jambo-dark hover:text-jambo-green transition-colors"
            >
              Talk to us
            </a>
            <a href="/signIn" className="btn-primary">
              Admin Login
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-jambo-dark">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-sm font-semibold text-jambo-green bg-green-50 px-4 py-2 rounded-full">
                Licensed NDSFP No. 021/2024
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-display font-bold">
                <span className="text-jambo-green">Fast</span>
              </h1>
              <h1 className="text-6xl md:text-7xl font-display font-bold">
                <span className="text-jambo-green">Simple</span>
              </h1>
              <h1 className="text-6xl md:text-7xl font-display font-bold">
                <span className="text-jambo-green">Flexible</span>
              </h1>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              We provide fast, simple, and collateral-free micro-loans tailored
              for low-income earners & SMEs, with low interest rates,
              streamlined vetting, and credit score improvement.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary text-lg">Get Started</button>
              <button className="btn-secondary text-lg">Learn More</button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-jambo-green text-2xl font-bold mb-2">
                  ⚡
                </div>
                <p className="text-sm font-semibold">Speed & Agility</p>
              </div>
              <div className="text-center">
                <div className="text-jambo-green text-2xl font-bold mb-2">
                  🎯
                </div>
                <p className="text-sm font-semibold">
                  Flexibility & Adaptability
                </p>
              </div>
              <div className="text-center">
                <div className="text-jambo-green text-2xl font-bold mb-2">
                  ✨
                </div>
                <p className="text-sm font-semibold">
                  Simplicity at Every Step
                </p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-jambo-green to-green-400 rounded-[3rem] p-12 shadow-2xl">
                <div className="space-y-4">
                  {/* Decorative cards */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="h-4 bg-jambo-green rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="bg-jambo-yellow rounded-2xl p-6 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                    <div className="h-4 bg-white rounded w-2/3 mb-3"></div>
                    <div className="h-3 bg-white/50 rounded w-1/2"></div>
                  </div>
                  <div className="bg-jambo-red rounded-2xl p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="h-4 bg-white rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-white/50 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-jambo-yellow rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-jambo-green rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
