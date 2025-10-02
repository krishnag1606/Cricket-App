import { Header } from "@/components/header";
import { SettingsClient } from "@/components/settings-client";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <SettingsClient />
      </main>
    </div>
  );
}
