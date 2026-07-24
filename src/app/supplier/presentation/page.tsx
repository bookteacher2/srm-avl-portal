"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, MapPin, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { useAuth } from "@/providers/auth-provider";
import { useAsync } from "@/hooks/use-async";
import { applicationService, bookingService } from "@/lib/services";
import { upcomingThursdays, PRESENTATION_SLOT_TIMES } from "@/lib/domain/presentation";
import { formatDate, cn } from "@/lib/utils";

export default function PresentationPage() {
  const { user } = useAuth();
  const supplierId = user?.supplierId ?? "";
  const [selectedDate, setSelectedDate] = useState<string>(upcomingThursdays()[0] ?? "");
  const [booking, setBooking] = useState(false);

  const { data, loading, error, reload } = useAsync(async () => {
    const app = await applicationService.currentForSupplier(supplierId);
    const existing = app ? await bookingService.getByApplication(app.id) : null;
    const slots = existing ? [] : await bookingService.availableSlots(selectedDate);
    return { app, existing, slots };
  }, [supplierId, selectedDate]);

  async function handleBook(time: string) {
    if (!data?.app) return;
    setBooking(true);
    try {
      await bookingService.book({
        applicationId: data.app.id,
        supplierId,
        date: selectedDate,
        time,
        location: "Procurement Meeting Room, Head Office",
      });
      toast.success("Presentation booked", { description: `${formatDate(selectedDate)} at ${time}` });
      reload();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBooking(false);
    }
  }

  const thursdays = upcomingThursdays();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Presentation Booking"
        description="Book your committee presentation. Sessions are held on Thursdays."
      />
      <DataState loading={loading} error={error}>
        {data?.existing ? (
          <Card className="max-w-xl">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Presentation Confirmed</p>
                  <Badge variant="success" className="mt-1">{data.existing.status}</Badge>
                </div>
              </div>
              <div className="space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
                <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> {formatDate(data.existing.date)} at {data.existing.time}</p>
                {data.existing.location ? (
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {data.existing.location}</p>
                ) : null}
                {data.existing.meetingLink ? (
                  <p className="flex items-center gap-2"><Video className="h-4 w-4 text-primary" /> {data.existing.meetingLink}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select a Thursday</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {thursdays.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-sm transition-colors",
                      selectedDate === d ? "border-primary bg-primary/5 font-medium" : "border-border hover:bg-muted",
                    )}
                  >
                    {formatDate(d)}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Slots · {formatDate(selectedDate)}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {PRESENTATION_SLOT_TIMES.map((time) => {
                  const open = data?.slots.includes(time);
                  return (
                    <Button
                      key={time}
                      variant={open ? "outline" : "ghost"}
                      disabled={!open || booking}
                      onClick={() => handleBook(time)}
                    >
                      {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : time}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </DataState>
    </div>
  );
}
