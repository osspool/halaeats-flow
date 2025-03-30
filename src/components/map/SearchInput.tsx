
import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  placeholder: string;
  onFocus?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  isLoading,
  placeholder,
  onFocus,
  onSubmit,
  onKeyDown
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
    
    // Call parent onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-halaeats-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 border border-halaeats-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
      />
      {isLoading && (
        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-halaeats-400 animate-spin" />
      )}
    </div>
  );
};

export default SearchInput;
