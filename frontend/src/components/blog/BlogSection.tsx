import React from 'react';
import { motion } from 'framer-motion';
import { BLOG_ARTICLES, WORLD_CUP_WINNERS, CHAMPION_COUNTS } from '../../utils/groupData';

export function BlogSection() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 px-4">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-block px-4 py-1 bg-fifa-blue/20 text-fifa-blue rounded-full text-sm font-semibold mb-4 border border-fifa-blue/30">
          Football Heritage
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 leading-tight">
          History of the{' '}
          <span className="text-gold">FIFA World Cup</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          From a small tournament in Uruguay in 1930 to a 48-team global
          spectacle in 2026 — the story of football's greatest stage.
        </p>
      </motion.div>

      {/* Articles grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG_ARTICLES.map((article, i) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-fifa-blue/30 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl leading-none select-none shrink-0">
                {article.icon}
              </span>
              <div>
                <div className="text-xs text-text-muted font-mono mb-1">
                  {article.date}
                </div>
                <h2 className="text-base font-bold text-text-primary mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Most successful nations */}
      <div>
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          Most Successful Nations
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Titles won across all World Cup tournaments
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(CHAMPION_COUNTS)
            .sort(([, a], [, b]) => b - a)
            .map(([nation, count]) => (
              <div
                key={nation}
                className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl hover:border-gold/30 transition-colors"
              >
                <span className="text-sm font-medium text-text-primary">
                  {nation}
                </span>
                <span className="text-sm font-extrabold text-gold">
                  {count}×
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* All-time winners table */}
      <div>
        <h2 className="text-2xl font-extrabold text-text-primary mb-2">
          All World Cup Finals
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Complete results from 1930 to 2022
        </p>
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-4 py-3 text-text-secondary font-semibold">
                  Year
                </th>
                <th className="text-left px-4 py-3 text-text-secondary font-semibold">
                  Host
                </th>
                <th className="text-left px-4 py-3 text-gold font-semibold">
                  🏆 Champion
                </th>
                <th className="text-left px-4 py-3 text-text-secondary font-semibold">
                  🥈 Runner-up
                </th>
              </tr>
            </thead>
            <tbody>
              {[...WORLD_CUP_WINNERS].reverse().map((w, i) => (
                <tr
                  key={w.year}
                  className={`border-b border-border/50 transition-colors hover:bg-surface-hover ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-bold text-text-primary">
                    {w.year}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{w.host}</td>
                  <td className="px-4 py-3 font-bold text-text-primary">
                    {w.champion}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {w.runner_up}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}