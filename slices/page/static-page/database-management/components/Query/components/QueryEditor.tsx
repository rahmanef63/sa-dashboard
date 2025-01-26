import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import DataTable from '@/shared/components/DataTable';
import { PlayIcon, BookOpenIcon, CodeIcon } from 'lucide-react';
import { QueryDialog } from './QueryDialog';
import { QueryGeneratorDialog } from './QueryGeneratorDialog';
import { QueryItem } from '../constants/types';

interface QueryEditorProps {
  databaseName: string;
  readQueries: QueryItem[];
}

export function QueryEditor({ databaseName, readQueries }: QueryEditorProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isQueryGeneratorOpen, setIsQueryGeneratorOpen] = useState(false);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/database/${databaseName}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute query');
      }

      const data = await response.json();
      
      if (data.rows && data.rows.length > 0) {
        // Extract column names from the first row
        const cols = Object.keys(data.rows[0]).map(key => ({
          key: key as keyof any,
          header: key,
          render: (value: any) => String(value),
        }));
        setColumns(cols);
        setResults(data.rows);
      } else {
        setColumns([]);
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (selectedQuery: string) => {
    const selectedItem = readQueries.find(q => q.name === selectedQuery);
    if (selectedItem) {
      setQuery(selectedItem.query);
    }
  };

  const handleQueryGenerated = (generatedQuery: string) => {
    setQuery(generatedQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="w-full">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className="min-h-[200px] font-mono"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={executeQuery}
            disabled={isLoading || !query.trim()}
            className="flex-shrink-0"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Run Query
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSamplesOpen(true)}
            className="flex-shrink-0"
          >
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Sample Queries
          </Button>
          {/*quuery generator using existing data from database */}
          <Button
            variant="outline"
            onClick={() => setIsQueryGeneratorOpen(true)}
            className="flex-shrink-0"
          >
            <CodeIcon className="h-4 w-4 mr-2" />
            Query Generator
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          Executing query...
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="border rounded-lg">
          <DataTable
            data={results}
            columns={columns}
          />
        </div>
      )}

      {!isLoading && !error && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No results
        </div>
      )}

      <QueryGeneratorDialog
        isOpen={isQueryGeneratorOpen}
        onClose={() => setIsQueryGeneratorOpen(false)}
        onQueryGenerated={handleQueryGenerated}
        databaseName={databaseName}
      />

      <QueryDialog 
        open={isSamplesOpen}
        onOpenChange={setIsSamplesOpen}
        onSelectQuery={setQuery}
      />
    </div>
  );
}
