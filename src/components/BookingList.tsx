
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Booking, 
  formatCurrency, 
  formatDate 
} from '@/utils/mockData';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useStaggeredAnimation } from '@/utils/animations';

interface BookingListProps {
  bookings: Booking[];
  className?: string;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, className }) => {
  const visibleItems = useStaggeredAnimation(bookings.length, 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className={className}>
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg border border-border/60 overflow-hidden">
        <div className="py-4 px-6 border-b border-border/60 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Bookings</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] whitespace-nowrap">
                  <Button variant="ghost" size="sm" className="text-muted-foreground font-medium px-0">
                    Booking ID
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="whitespace-nowrap">Check In/Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={booking.id}
                  style={{ 
                    opacity: visibleItems[index] ? 1 : 0,
                    transform: visibleItems[index] ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease'
                  }}
                >
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>
                    <div>{booking.propertyName}</div>
                    <div className="text-xs text-muted-foreground">{booking.roomType}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div>{formatDate(booking.checkIn)}</div>
                    <div className="text-xs text-muted-foreground">to {formatDate(booking.checkOut)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Modify booking</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancel booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
