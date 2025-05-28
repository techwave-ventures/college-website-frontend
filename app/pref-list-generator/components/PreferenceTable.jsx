// Component: app/dashboard/_components/PreferenceTable.jsx

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui Table components

// Helper function to truncate text at word boundaries and add a newline if necessary
const formatText = (text, maxLength) => {
  if (!text) return 'N/A';

  // If the text is already within or exactly the max length, return it as is.
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space within the first `maxLength` characters of the text.
  let breakPoint = text.lastIndexOf(' ', maxLength - 1); // Search up to (maxLength - 1) to ensure we don't include a space at maxLength itself

  // If no space is found within the limit, or if the found space is at the very beginning (index 0),
  // it means a single word is longer than maxLength, or the first word starts at 0 and extends beyond.
  // In such cases, we have to break the word. Otherwise, we split at the last space found.
  if (breakPoint === -1 || breakPoint === 0) {
    // If it's one very long word, we'll break it at maxLength.
    // If the entire text is shorter than maxLength, it would have returned earlier.
    breakPoint = maxLength;
  }

  const firstLine = text.substring(0, breakPoint).trim();
  const remainingText = text.substring(breakPoint).trim();

  // If after trimming, there's no remaining text (e.g., the original text was exactly maxLength or a clean break),
  // just return the first line. This avoids an empty second line with only a <br/>.
  if (remainingText === '') {
    return firstLine;
  }

  return (
    <>
      {firstLine}
      <br />
      {remainingText}
    </>
  );
};

export default function PreferenceTable({ data }) {
  // Ensure we access the preferences array correctly, default to empty array
  const preferences = data?.preferences || [];

  if (preferences.length === 0) {
    return (
        <div className="text-center py-10 text-gray-500 bg-gray-50 p-6 rounded-md border border-dashed">
            <p>No preference data found based on your selections.</p>
            <p className="text-sm mt-1">Try adjusting your percentile or adding more branches/places.</p>
        </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden"> {/* Container for rounded corners */}
      <Table className="min-w-full bg-white">
        <TableCaption className="mt-4 mb-2 text-sm text-gray-600">
            Your personalized college preference list. Ranks are based on previous year cutoffs and your profile.
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[50px] px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">#</TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">College Code</TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">College Name</TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Choice Code</TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Branch</TableHead>
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</TableHead>
            {/* <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cutoff</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {preferences.map((item, index) => (
            // Use item['Choice Code'] or a unique ID from item if available for the key
            <TableRow key={item['Choice Code'] || index} className="hover:bg-gray-50 transition-colors">
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['College Code'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 text-sm font-medium text-gray-900">{formatText(item['College Name'], 75)}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Choice Code'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 text-sm text-gray-700">{formatText(item['Branch'], 25)}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Place'] || 'N/A'}</TableCell>
              {/* <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Cutoff'] || 'N/A'}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}