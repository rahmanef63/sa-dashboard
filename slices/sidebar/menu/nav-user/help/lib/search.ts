export function searchHelp(query: string, articles: any[]) {
  // Implement help search functionality
  return articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase())
  )
}
