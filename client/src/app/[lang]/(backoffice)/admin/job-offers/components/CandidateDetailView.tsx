/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  Users,
  X,
  MoreVertical,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateProfile } from "./types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/libs/utils";
import QualificationsLists from "@/components/profile/profile-page/QualificationsLists";
import { getDictionary } from "@/utils/getDictionaryClient";

interface CandidateDetailViewProps {
  candidate: CandidateProfile;
  onBack: () => void;
  onClose: () => void;
}

export function CandidateDetailView({
  candidate,
  onBack,
  onClose,
}: CandidateDetailViewProps) {
  const { personalInformation: pi } = candidate;
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    // Fetch dictionary for 'en' locale as default
    const fetchDict = async () => {
      const dict = await getDictionary("en");
      setDictionary(dict);
    };
    fetchDict();
  }, []);

  const handleAcceptConfirm = (data: any) => {
    console.log(
      `Accepted candidate ${candidate._id}. Interview Details:`,
      data,
    );
    alert(
      `Candidate Accepted! Interview scheduled on ${
        data.date ? format(data.date, "PPP") : "N/A"
      } at ${data.time}.\n\nEmail sent to ${pi.email}`,
    );
    // TODO: Call backend to update status and send email
  };

  const handleStatusChange = (status: "accepted" | "rejected") => {
    if (status === "accepted") {
      setIsAcceptModalOpen(true);
      return;
    }
    // TODO: Connect to backend API
    console.log(`Setting candidate ${candidate._id} status to ${status}`);
    // Simulate email notification
    alert(`Rejection email queued for ${pi.email}`);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 text-white hover:bg-green-600 border-transparent shadow-sm";
      case "rejected":
        return "bg-orange-500 text-white hover:bg-orange-600 border-transparent shadow-sm";
      default: // pending
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        {/* 
          Added [&>button]:hidden to hide the default top-right close button 
          to prevent overlap with our custom header.
      */}
        <DialogContent className="max-w-full w-full h-[100dvh] flex flex-col p-0 gap-0 overflow-hidden [&>button]:hidden rounded-none">
          {/* Header */}
          <div className="h-16 px-4 md:px-6 border-b bg-background flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="h-9 gap-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Separator
                orientation="vertical"
                className="h-6 hidden sm:block"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hidden sm:inline">
                  Application Review
                </span>
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-muted-foreground"
                >
                  <span className="inline sm:hidden">#</span>
                  <span className="hidden sm:inline">ID:</span>{" "}
                  {candidate._id.toUpperCase().slice(0, 8)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Decision Actions */}
              <div className="flex items-center bg-muted/50 p-1 rounded-md gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 md:px-3 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
                  onClick={() => handleStatusChange("rejected")}
                >
                  <X className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Reject</span>
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button
                  size="sm"
                  className="h-8 px-2 md:px-3 bg-green-600 text-white hover:bg-green-700 shadow-sm transition-all font-medium"
                  onClick={() => handleStatusChange("accepted")}
                >
                  <Check className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Accept</span>
                </Button>
              </div>

              <Separator
                orientation="vertical"
                className="h-6 mx-1 hidden sm:block"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hidden sm:flex"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Flag as duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Report issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Custom Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onClose}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left Sidebar: Personal Info */}
            <div className="w-full md:w-80 border-r bg-muted/5 p-4 md:p-6 overflow-y-auto shrink-0 max-h-[35vh] md:max-h-full border-b md:border-b-0">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 mb-4 border-4 border-background shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${pi.prenom} ${pi.nom}`}
                  />
                  <AvatarFallback className="text-2xl">
                    {pi.prenom?.[0]}
                    {pi.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {pi.prenom} {pi.nom}
                </h2>
                <p className="text-lg font-arabic text-muted-foreground">
                  {pi.prenomAr} {pi.nomAr}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 capitalize ${getStatusBadgeClasses(
                    candidate.status,
                  )}`}
                >
                  {candidate.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <InfoItem
                  icon={<UserIcon className="h-4 w-4" />}
                  label="CIN"
                  value={pi.cin}
                />
                <InfoItem
                  icon={<CalendarIcon className="h-4 w-4" />}
                  label="Born"
                  value={
                    pi.dateNaissance
                      ? new Date(pi.dateNaissance).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="Status"
                  value={pi.situation}
                />
                <InfoItem
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Civil Servant"
                  value={pi.experiences?.fonctionnaire ? "Yes" : "No"}
                />
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="Disability Status"
                  value={
                    pi.situationDeHandicap?.handicap
                      ? `Yes (${pi.situationDeHandicap.typeHandicap || "Not specified"})`
                      : "No"
                  }
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={pi.telephone}
                />
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={pi.adresse}
                />
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={pi.email}
                />
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Core Documents
              </h3>
              <div className="space-y-2">
                <FileLink label="CV" filename={pi.files?.cvPdf} />
                <FileLink label="CIN Scanned" filename={pi.files?.cinPdf} />
                <FileLink label="Baccalaureate" filename={pi.files?.bacPdf} />
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Application Documents
              </h3>
              <div className="space-y-2">
                <FileLink
                  label="Declaration"
                  filename={candidate.attachment?.declarationPdf}
                />
                <FileLink
                  label="Motivation Letter"
                  filename={candidate.attachment?.motivationLetterPdf}
                />
              </div>
            </div>

            {/* Right Content: Professional Info */}
            <ScrollArea className="flex-1 bg-background h-full">
              <div className="p-4 md:p-8 pb-20">
                <Tabs defaultValue="professional" className="w-full">
                  <TabsList className="mb-6 w-full flex-wrap h-auto justify-start bg-muted/50 p-1">
                    <TabsTrigger
                      value="professional"
                      className="flex-1 sm:flex-none"
                    >
                      Professional Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="flex-1 sm:flex-none"
                    >
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  {/* Professional Info Tab */}
                  <TabsContent value="professional" className="space-y-6">
                    {dictionary && (
                      <QualificationsLists
                        locale="en"
                        candidatureData={{
                          // Construct a partial CandidatureType matching what QualificationLists expects
                          personalInformation:
                            candidate.personalInformation as any,
                          professionalInformation:
                            candidate.professionalInformation as any,
                        }}
                        dictionary={dictionary}
                      />
                    )}
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Additional Documents
                      </h3>
                      <div className="space-y-2">
                        {/* Add more document viewers here if needed */}
                        <div className="text-muted-foreground bg-muted/10 p-4 rounded border border-dashed">
                          Documents are already listed in the sidebar.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      <AcceptCandidateModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={handleAcceptConfirm}
        candidateName={`${pi.prenom} ${pi.nom}`}
      />
    </>
  );
}

// --- MODAL COMPONENT ---

interface AcceptCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: unknown) => void;
  candidateName: string;
}

function AcceptCandidateModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
}: AcceptCandidateModalProps) {
  const [invitationType, setInvitationType] = useState<"interview" | "test">(
    "interview",
  );
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const formattedDate = date ? format(date, "PPP") : "[Date]";
    const formattedTime = time || "[Time]";
    const loc = location || "[Location]";
    const typeText =
      invitationType === "interview" ? "an interview" : "a written test";

    const newMessage = `Dear ${candidateName},\n\nWe are pleased to inform you that your profile has been selected for the next stage of our recruitment process.\n\nWe would like to invite you for ${typeText} on ${formattedDate} at ${formattedTime}.\n\nLocation: ${loc}\n\nPlease confirm your presence.\n\nBest regards,\nThe Recruitment Team`;

    setMessage(newMessage);
  }, [date, time, location, invitationType, candidateName]);

  const handleConfirm = () => {
    onConfirm({ invitationType, date, time, location, message });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule Next Step & Accept</DialogTitle>
          <DialogDescription>
            Schedule an interview or written test for {candidateName}. This will
            send an email invitation and change the status to
            &quot;Accepted&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Invitation Type</Label>
            <Select
              value={invitationType}
              onValueChange={(v: "interview" | "test") => setInvitationType(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="test">Written Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  className="pl-9"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location / Meeting Link</Label>
            <Input
              id="location"
              placeholder="e.g. Headquarters in Rabat, or Google Meet Link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Email Message (Auto-generated)</Label>
            <Textarea
              id="message"
              className="h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!date || !time}
          >
            Confirm & Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- HELPER COMPONENTS ---

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="text-muted-foreground mt-0.5 w-4 flex justify-center">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="font-medium text-xs text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
);

const FileLink = ({ label, filename }: { label: string; filename: string }) => {
  const handleDownload = () => {
    // In a real app, you'd trigger a download via an API endpoint
    // For this example, we'll just log it.
    console.log(`Downloading ${filename}`);
    alert(`Simulating download for: ${filename}`);
  };

  if (!filename) {
    return (
      <div className="flex items-center justify-between p-2 rounded border bg-muted/20 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 truncate">
          <FileText className="h-3.5 w-3.5" />
          <span className="truncate">{label} (Not provided)</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleDownload}
      className="flex items-center justify-between p-2 rounded border bg-background text-sm hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 truncate">
        <FileText className="h-3.5 w-3.5 text-blue-500" />
        <span className="truncate">{label}</span>
      </div>
      <Download className="h-3 w-3 text-muted-foreground" />
    </div>
  );
};
