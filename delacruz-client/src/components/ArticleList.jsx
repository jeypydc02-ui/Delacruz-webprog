import { Link } from 'react-router-dom';
import Button from './Button';

const ArticleList = ({ articles }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {articles.map((article, index) => (
        <article
          key={article.name}
          className="flex flex-col rounded-3xl border-2 border-[#3d4a2e] bg-[#E4DFB5] overflow-hidden"
        >
          {/* Article thumbnail */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full aspect-4/3 object-cover rounded-[1.25rem_1.25rem_0_0]"
          />

          <div className="flex flex-1 flex-col p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
              Article {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 text-base font-semibold leading-snug text-[#3d4a2e]">
              {article.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#5a6e44]">
              {article.content[0].substring(0, 120)}...
            </p>
            <Link to={`/articles/${article.name}`} className="mt-4">
              <Button className="w-full">Read More</Button>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ArticleList;