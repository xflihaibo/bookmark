import { EnterpriseLinksGridProps, EnterpriseLink } from "@/types";

export const EnterpriseLinksGrid: React.FC<EnterpriseLinksGridProps> = ({
  enterpriseLinks,
  isDark
}) => {
  const linksByCategory: Record<string, EnterpriseLink[]> = {};

  enterpriseLinks.forEach(link => {
    const category = link.category || "未分类";

    if (!linksByCategory[category]) {
      linksByCategory[category] = [];
    }

    linksByCategory[category].push(link);
  });

  return (
    <div
      className={`w-full max-w-[1280px] mx-auto backdrop-blur-lg rounded-2xl p-4 border shadow-xl mt-4 overflow-hidden max-h-[500px] overflow-y-auto ${isDark ? "bg-white/10 border-white/18" : "bg-white/70 border-gray-200"}`}>
      {Object.entries(linksByCategory).map(
        ([category, links]) => <div key={category} className="mb-0.5 pb-4 last:mb-0 last:pb-0">
          <h3
            className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
            style={{
              fontSize: "14px"
            }}>
            {category}
          </h3>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {links.map((link, index) => <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-none p-2 rounded-lg transition-all duration-300 ${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
              title={link.url}>
              <div className="flex items-center">
                <span className="text-sm truncate">{link.name}</span>
              </div>
            </a>)}
          </div>
        </div>
      )}
    </div>
  );
};