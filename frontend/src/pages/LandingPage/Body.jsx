import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";
export default function Body() {
  return (
    <div className="font-sans text-gray-300 bg-[#0a0a0a] overflow-x-hidden selection:bg-blue-500/30">
      {/* ── HERO ────────────────────────────────────────────────────── */}
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[300px] md:min-h-[420px] bg-[#0a0a0a]">
        <div
          className="absolute inset-0 bg-[#161616]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Illustration card */}
          <div className="flex items-center justify-center">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl shadow-2xl rotate-[-7deg] w-[220px] h-[148px] md:w-[300px] md:h-[200px] p-3 md:p-5 flex flex-col gap-2 md:gap-3">
              <div className="flex gap-1.5 md:gap-2 items-center">
                <div className="h-6 md:h-9 flex-1 bg-[#4fc3f7] rounded-md opacity-80" />
                <div className="h-6 md:h-9 flex-1 bg-[#81c784] rounded-md opacity-80" />
                <div className="h-6 md:h-9 flex-1 bg-[#ffb74d] rounded-md opacity-80" />
                <div className="h-6 md:h-9 flex-1 bg-[#ef5350] rounded-md opacity-80" />
                <div
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full ml-1 flex-shrink-0 opacity-90"
                  style={{
                    background:
                      "conic-gradient(#4fc3f7 0deg 200deg, #333 200deg 360deg)",
                  }}
                />
              </div>
              <div className="flex gap-2 md:gap-3 flex-1">
                <div className="flex flex-col gap-1 flex-1">
                  {[100, 85, 90, 70, 80].map((w, i) => (
                    <div
                      key={i}
                      className="h-1 md:h-1.5 bg-[#333] rounded-full"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-1 md:gap-1.5 pt-0.5">
                  {["#4caf50", "#ef5350", "#ffa116", "#4caf50", "#ef5350"].map(
                    (c, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-80"
                        style={{ background: c }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="flex flex-col gap-4 md:gap-5 items-center md:items-start text-center md:text-left">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
              A New Way
              <br />
              to Learn
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
              LeetCode is the best platform to help you enhance your skills,
              expand your knowledge and prepare for technical interviews.
            </p>
            <button className="inline-flex items-center gap-2 border-2 border-[#00b8a3] text-[#00b8a3] hover:bg-[#00b8a3]/10 px-5 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer">
              Create Account <span>›</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── START EXPLORING ─────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-4 md:gap-5 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <h2 className="text-[#00b8a3] text-2xl md:text-3xl font-extrabold">
                Start Exploring
              </h2>
              <div
                className="w-9 h-9 md:w-11 md:h-11 bg-[#00b8a3]/20 text-[#00b8a3] flex items-center justify-center text-base md:text-lg flex-shrink-0"
                style={{
                  clipPath:
                    "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                }}
              >
                🎓
              </div>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
              {" "}
              Explore is a well-organized tool that helps you get the most out
              of LeetCode by providing structure to guide your progress
              towards the next step in your programming career.
            </p>
            <a
              href="#"
              className="text-[#00b8a3] font-bold text-sm hover:underline flex items-center gap-1"
            >
              Get Started <span>›</span>
            </a>
          </div>

          {/* Card stack */}
          <div className="relative h-[160px] md:h-[220px] w-[260px] md:w-auto mx-auto md:mx-0">
            <div className="absolute top-4 md:top-5 left-0 w-[200px] md:w-[280px] h-[130px] md:h-[180px] bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl rotate-[-7deg]" />
            <div className="absolute top-2.5 md:top-3 left-4 md:left-5 w-[200px] md:w-[280px] h-[130px] md:h-[180px] bg-[#222] border border-[#333] rounded-2xl rotate-[-3.5deg]" />
            <div className="absolute top-1 left-8 md:left-10 w-[200px] md:w-[280px] h-[130px] md:h-[180px] bg-[#2a2a2a] border border-[#00b8a3]/50 shadow-lg rounded-2xl z-10 flex items-center justify-center">
              <div className="absolute top-3 left-3 right-3 flex flex-col gap-1.5">
                <div className="h-2 md:h-2.5 bg-[#444] rounded w-3/5" />
                <div className="h-2 md:h-2.5 bg-[#444] rounded w-full" />
              </div>
              <div className="w-10 h-10 md:w-14 md:h-14 bg-[#1e1e1e] border border-[#444] rounded-full flex items-center justify-center shadow-md text-base md:text-xl text-gray-300">
                ▶
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ───────────────────────────────────────────── */}
      <section className="bg-[#111] border-y border-[#222] py-14 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-[#00b8a3] text-lg md:text-xl font-extrabold">
              Questions, Community &amp; Contests
            </h3>
            <p className="text-gray-400 text-sm leading-loose">
              Over 1750 questions for you to practice. Come and join one of the
              largest tech communities with hundreds of thousands of active
              users and participate in our contests to challenge yourself and
              earn rewards.
            </p>
            <a
              href="#"
              className="text-[#00b8a3] font-bold text-sm hover:underline flex items-center gap-1 w-fit"
            >
              View Questions <span>›</span>
            </a>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-[#ffb800] text-lg md:text-xl font-extrabold">
              Companies &amp; Candidates
            </h3>
            <p className="text-gray-400 text-sm leading-loose">
              Not only does LeetCode prepare candidates for technical
              interviews, we also help companies identify top technical talent.
              From sponsoring contests to providing online assessment and
              training, we offer numerous services to businesses.
            </p>
            <a
              href="#"
              className="text-[#ffb800] font-bold text-sm hover:underline flex items-center gap-1 w-fit"
            >
              Business Opportunities <span>›</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ───────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-14 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4 md:gap-5">
          <div
            className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 text-blue-400 flex items-center justify-center text-base md:text-lg"
            style={{
              clipPath:
                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
            }}
          >
            <i className="fa-solid fa-code"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            Developer
          </h2>
          <p className="text-gray-400 text-sm leading-loose max-w-xl">
            We now support 14 popular coding languages. At our core, LeetCode is
            about developers. Our powerful development tools such as Playground
            help you test, debug and more with your own projects online.
          </p>

          <div className="relative w-full max-w-2xl mt-3 md:mt-4 lg:mr-[180px]">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
              <div className="flex gap-1.5 bg-[#252525] border-b border-[#333] px-3 py-2">
                {["C++", "Java", "Python"].map((t, i) => (
                  <div
                    key={t}
                    className={`px-2 md:px-3 py-1 rounded text-xs font-bold ${i === 0 ? "bg-[#1e1e1e] text-white border border-[#333] border-b-transparent translate-y-[1px]" : "text-gray-500 hover:text-gray-300 cursor-pointer"}`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="p-3 md:p-4 text-left font-mono text-[10px] md:text-xs leading-6 md:leading-7 overflow-x-auto">
                {[
                  [
                    21,
                    <>
                      <span className="text-purple-400">int</span>{" "}
                      <span className="text-blue-400">twoSum</span>(
                      <span className="text-purple-400">vector</span>&lt;
                      <span className="text-purple-400">int</span>&gt;&amp;
                      nums, <span className="text-purple-400">int</span> target){" "}
                      {"{"}
                    </>,
                  ],
                  [
                    22,
                    <>
                      &nbsp;&nbsp;
                      <span className="text-purple-400">unordered_map</span>&lt;
                      <span className="text-purple-400">int</span>,
                      <span className="text-purple-400">int</span>&gt; mp;
                    </>,
                  ],
                  [
                    23,
                    <>
                      &nbsp;&nbsp;<span className="text-purple-400">for</span>(
                      <span className="text-purple-400">int</span> i=
                      <span className="text-orange-400">0</span>;
                      i&lt;nums.size(); i++) {"{"}
                    </>,
                  ],
                  [
                    24,
                    <>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-purple-400">if</span>
                      (mp.count(target - nums[i]))
                    </>,
                  ],
                  [
                    25,
                    <>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-purple-400">return</span> {"{"}
                      mp[target-nums[i]], i{"}"};
                    </>,
                  ],
                  [26, <>&nbsp;&nbsp;&nbsp;&nbsp;mp[nums[i]] = i;</>],
                  [27, <>&nbsp;&nbsp;{"}"}</>],
                  [
                    28,
                    <>
                      &nbsp;&nbsp;
                      <span className="text-purple-400">return</span> {"{}"};
                    </>,
                  ],
                  [29, <>{"}"}</>],
                ].map(([ln, code]) => (
                  <div key={ln} className="flex gap-3 whitespace-nowrap">
                    <span className="text-gray-600 min-w-[18px] text-right select-none">
                      {ln}
                    </span>
                    <span className="text-gray-300">{code}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block absolute right-[-175px] top-1/2 -translate-y-1/2 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl p-4 w-40 text-left">
              {[
                ["Linked List", "text-purple-400", "bg-purple-500"],
                ["Binary Tree", "text-red-400", "bg-red-500"],
                ["Fibonacci", "text-green-400", "bg-green-500"],
                ["Merge Sort", "text-[#00b8a3]", "bg-[#00b8a3]"],
              ].map(([label, textColor, dotColor]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs text-gray-300 py-2 border-b border-[#2d2d2d] last:border-0 hover:bg-[#252525] px-2 -mx-2 rounded transition-colors cursor-pointer"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor} shadow-[0_0_8px_currentColor]`}
                  />
                  <span className={textColor}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-[#222] py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:gap-8 text-center">
          <div
            className="w-10 h-10 md:w-12 md:h-12 bg-[#ff2d55]/20 text-[#ff2d55] flex items-center justify-center"
            style={{
              clipPath:
                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
            }}
          >
            <i className="fa-solid fa-heart"></i>
          </div>

          <p className="text-lg md:text-xl font-extrabold text-white">
            Made with <span className="text-[#ff2d55]">♥</span> in SF
          </p>

          <p className="text-gray-400 text-sm leading-loose max-w-md">
            At LeetCode, our mission is to help you improve yourself and land
            your dream job. We have a sizable repository of interview resources
            for many companies. In the past five years, our users have landed
            jobs at top companies around the world.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center max-w-lg md:max-w-none">
            {[
              "facebook",
              "LEAP",
              "Apple",
              "UBER",
              "Palantir",
              "Jeb",
              "intel",
              "amazon",
              "BankofAmerica",
              "Pinterest",
              "Cisco",
              "stripe",
            ].map((logo) => (
              <span
                key={logo}
                className="text-gray-500 hover:text-white font-bold text-xs md:text-sm tracking-tight transition-colors cursor-pointer"
              >
                {logo}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-3 mt-4">
            <p className="text-gray-400 text-sm leading-loose max-w-sm">
              If you are passionate about tackling some of the most interesting
              problems around, we would love to hear from you.
            </p>
            <a
              href="#"
              className="text-[#00b8a3] font-bold text-sm hover:underline flex items-center gap-1"
            >
              Join Our Team <span>›</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
