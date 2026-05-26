import Button from '../components/Button';

const PETS = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Golden Retriever Mix',
    age: '2 yrs',
    tag: 'Dog',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  },
  {
    id: 2,
    name: 'Mochi',
    breed: 'Domestic Shorthair',
    age: '1 yr',
    tag: 'Cat',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
  },
  {
    id: 3,
    name: 'Biscuit',
    breed: 'Beagle',
    age: '3 yrs',
    tag: 'Dog',
    img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&q=80',
  },
];

const HomePage = () => {
  return (
    <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>

      {/* Hero */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
              Find Your Forever Friend
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#5a6e44] sm:text-5xl">
              Every pet deserves a place called home.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#5a6e44] sm:text-base">
              HomeFound connects loving families with rescue animals across the Philippines.
              Browse hundreds of cats, dogs, and small animals waiting for someone just like you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/about" variant="primary">
                Meet Our Pets
              </Button>
              <Button to="/articles">
                How It Works
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border-2 border-[#3d4a2e]">
            <img
              src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=900&q=80"
              alt="A happy dog being held by its new owner"
              className="h-80 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Our Impact
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#5a6e44]">By the numbers</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '1,240+', label: 'Pets Adopted' },
            { value: '38', label: 'Rescue Partners' },
            { value: '4.9★', label: 'Avg. Rating' },
            { value: '100%', label: 'Non-Profit' },
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

      {/* Featured pets */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Available Now
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#5a6e44]">Pets looking for homes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PETS.map((pet) => (
            <article key={pet.id} className="rounded-3xl border-2 border-[#3d4a2e] bg-[#FBE8CE] overflow-hidden">
              <img
                src={pet.img}
                alt={`${pet.name} — ${pet.breed}`}
                className="h-52 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
                  {pet.tag} · {pet.age}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#3d4a2e]">{pet.name}</h3>
                <p className="mt-1 text-sm text-[#5a6e44]">{pet.breed}</p>
                <Button className="mt-4" variant="primary">
                  Meet {pet.name}
                </Button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button to="/articles">View All Pets</Button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            The Process
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#5a6e44]">Adopting is simple</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '01', title: 'Browse & Choose', body: 'Explore our full roster of rescued animals. Filter by species, age, and location to find your match.' },
            { step: '02', title: 'Apply Online', body: 'Fill out a short adoption application. Our team reviews it within 24 hours and reaches out directly.' },
            { step: '03', title: 'Welcome Home', body: 'After approval, schedule a meet-and-greet. Once everyone\'s happy, your new pet comes home.' },
          ].map(({ step, title, body }) => (
            <article key={step} className="rounded-3xl border-2 border-[#3d4a2e] bg-[#C3CC9B] p-5">
              <p className="text-3xl font-bold text-[#9AB17A]">{step}</p>
              <h3 className="mt-2 text-base font-semibold text-[#3d4a2e]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5a6e44]">{body}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;