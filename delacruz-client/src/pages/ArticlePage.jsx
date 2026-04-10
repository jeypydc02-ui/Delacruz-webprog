import Button from '../components/Button';

const ARTICLES = [
  {
    id: 1,
    tag: 'Adoption Guide',
    title: 'First week home: what to expect with a rescue dog',
    excerpt:
      'The first seven days are critical for building trust. Here\'s how to set your new dog up for a smooth transition into family life.',
    img: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80',
    readTime: '5 min read',
  },
  {
    id: 2,
    tag: 'Cat Care',
    title: 'Why cats hide — and when to be concerned',
    excerpt:
      'New environments can overwhelm even the most confident cats. Learn to read the signs and know when hiding is normal versus a health red flag.',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80',
    readTime: '4 min read',
  },
  {
    id: 3,
    tag: 'Welfare',
    title: 'The truth about spay and neuter in the Philippines',
    excerpt:
      'Overpopulation is the root cause of most shelter overcrowding. We unpack the myths, address the costs, and share free clinics near you.',
    img: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&q=80',
    readTime: '6 min read',
  },
  {
    id: 4,
    tag: 'Community',
    title: 'Meet the volunteers who make HomeFound possible',
    excerpt:
      'From weekend fosters to full-time rescuers, the people behind our network are the real story. We sat down with four of them.',
    img: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=600&q=80',
    readTime: '7 min read',
  },
];

const ArticlePage = () => {
  return (
    <div className="flex w-full flex-col gap-6" style={{ background: '#FBE8CE' }}>

      {/* Hero */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#E4DFB5] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
          Resources & Stories
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-[#5a6e44] sm:text-4xl">
         Guides, stories, and everything you need to be a great pet parent.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#5a6e44] sm:text-base">
          From first-time adopter tips to deep dives on animal welfare policy, our blog is
          written by our team, our vets, and the community members who live it every day.
        </p>
        <div className="mt-6">
          <Button to="/">Back Home</Button>
        </div>
      </section>

      {/* Article grid */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#FBE8CE] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
            Latest Articles
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#5a6e44]">From the HomeFound blog</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ARTICLES.map((article) => (
            <article key={article.id} className="flex flex-col rounded-3xl border-2 border-[#3d4a2e] bg-[#E4DFB5] overflow-hidden">
              <img
                src={article.img}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
                  {article.tag} · {article.readTime}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-snug text-[#3d4a2e]">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#5a6e44]">{article.excerpt}</p>
                <Button className="mt-4">Read More</Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y-2 border-[#3d4a2e] bg-[#3d4a2e] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-[#FBE8CE]">Ready to find your match?</h2>
        <p className="mt-3 text-sm leading-7 text-[#C3CC9B] max-w-md mx-auto">
          Hundreds of dogs and cats are waiting. Start your adoption journey today — it takes
          less than five minutes to apply.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="#adopt"
            className="rounded-full bg-[#9AB17A] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3d4a2e] transition hover:bg-[#C3CC9B]"
          >
            Browse Pets
          </a>
        </div>
      </section>

    </div>
  );
};

export default ArticlePage;