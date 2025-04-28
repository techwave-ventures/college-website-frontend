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
            <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cutoff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {preferences.map((item, index) => (
            // Use item['Choice Code'] or a unique ID from item if available for the key
            <TableRow key={item['Choice Code'] || index} className="hover:bg-gray-50 transition-colors">
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['College Code'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 text-sm font-medium text-gray-900">{item['College Name'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Choice Code'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 text-sm text-gray-700">{item['Branch'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Place'] || 'N/A'}</TableCell>
              <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{item['Cutoff'] || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}