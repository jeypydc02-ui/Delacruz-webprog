import { Link } from 'react-router-dom';
import Button from './Button';

// Accepts articles from either local seed (has .image) or backend (has .imageUrl)
const getImage = (article) => article.imageUrl || article.image || null;

const ArticleList = ({ articles }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {articles.map((article, index) => {
        const imgSrc = getImage(article);
        // slug for local seed uses article.name; backend-fetched uses article.slug
        const slug = article.slug ?? article.name;
        return (
          <article
            key={slug ?? index}
            className="flex flex-col rounded-3xl border-2 border-[#3d4a2e] bg-[#E4DFB5] overflow-hidden"
          >
            {/* Article thumbnail — real image or styled placeholder */}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={article.title}
                className="w-full aspect-4/3 object-cover rounded-[1.25rem_1.25rem_0_0]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full aspect-4/3 flex items-center justify-center bg-[#C3CC9B] rounded-[1.25rem_1.25rem_0_0]">
                <div className="h-16 w-16 border-2 border-[#3d4a2e] bg-[#9AB17A] rounded-2xl" />
              </div>
            )}

            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
                Article {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-base font-semibold leading-snug text-[#3d4a2e]">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#5a6e44]">
                {(article.preview ?? article.content?.[0] ?? '').substring(0, 120)}...
              </p>
              <Link to={`/articles/${slug}`} className="mt-4">
                <Button className="w-full">Read More</Button>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ArticleList;
