import Button from '../components/Button';
import IanImg from '../assets/ian.jpg';
import JoshImg from '../assets/josh.jpg';
import JpImg from '../assets/jp.jpg';

const TEAM = [
  {
    name: 'Ian Kenneth Sianghio',
    role: 'Founder & Director',
    img: IanImg,
  },
  {
    name: 'Joshua Marzan',
    role: 'Rescue Coordinator',
    img: JoshImg,
  },
  {
    name: 'John Paul DeLa Cruz',
    role: 'Adoption Counselor',
    img: JpImg,
  },
  {
    name: 'Diego Cruz',
    role: 'Vet & Animal Welfare',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  },
];

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>

      {/* Hero */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl border-2 border-[#3d4a2e]">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80"
              alt="Two dogs running happily in a park"
              className="h-80 w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
              Our Story
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-[#3d4a2e] sm:text-4xl">
              Born from love for animals, built for community.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#5a6e44] sm:text-base">
              HomeFound started in 2019 in Quezon City when our founder rescued her first dog from
              a flooded street. What began as a social media post became a network of volunteers,
              partner shelters, and thousands of happy adopters across Luzon.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#5a6e44] sm:text-base">
              We believe every animal deserves dignity, medical care, and a permanent home — not just
              a temporary kennel. Our model is simple: we rescue, rehabilitate, and rehome, supported
              entirely by donations and adoption fees.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">Back Home</Button>
              <Button to="/articles">Read Our Blog</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Profile Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#3d4a2e]">HomeFound at a glance</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '05', label: 'Years Active' },
            { value: '38', label: 'Partner Shelters' },
            { value: '1,240', label: 'Pets Rehomed' },
            { value: '03', label: 'Focus Areas' },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-3xl border-2 border-[#3d4a2e] bg-[#C3CC9B] p-5">
              <p className="text-2xl font-bold text-[#3d4a2e]">{value}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars + Team */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
              What We Stand For
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#3d4a2e]">Our three pillars</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'Rescue & Rehabilitate',
                  body: 'We work with 38 partner rescues to pull animals from kill shelters, the streets, and neglect situations. Every pet receives a full vet assessment, vaccinations, deworming, and spay/neuter before listing.',
                },
                {
                  title: 'Responsible Matching',
                  body: 'We don\'t just place animals — we match them. Our counselors assess lifestyle, home environment, and experience level to make sure every adoption has the best chance of being permanent.',
                },
                {
                  title: 'Community & Education',
                  body: 'Through our blog, workshops, and school outreach, we teach responsible pet ownership and humane treatment to the next generation of animal advocates.',
                },
              ].map(({ title, body }) => (
                <article key={title} className="rounded-3xl border-2 border-[#3d4a2e] bg-[#FBE8CE] p-5">
                  <h3 className="text-lg font-semibold text-[#3d4a2e]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5a6e44]">{body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#3d4a2e] bg-[#C3CC9B] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
              The Team
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {TEAM.map((member) => (
                <div key={member.name} className="overflow-hidden rounded-[1.25rem] bg-[#E4DFB5] border border-[#3d4a2e]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="h-28 w-full object-cover object-top"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-[#3d4a2e]">{member.name}</p>
                    <p className="text-[11px] text-[#5a6e44]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-5" to="/articles">Read Our Blog</Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;