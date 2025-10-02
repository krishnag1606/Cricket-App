"use client";

import { useMatch } from "@/hooks/use-match";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_SIMULATION_SETTINGS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  ballInterval: z.coerce.number().min(1).max(30),
  probabilities: z.object({
    dots: z.coerce.number().min(0).max(100),
    singles: z.coerce.number().min(0).max(100),
    doubles: z.coerce.number().min(0).max(100),
    triples: z.coerce.number().min(0).max(100),
    fours: z.coerce.number().min(0).max(100),
    sixes: z.coerce.number().min(0).max(100),
    wickets: z.coerce.number().min(0).max(100),
    wides: z.coerce.number().min(0).max(100),
    noBalls: z.coerce.number().min(0).max(100),
  }),
}).refine(data => {
    const totalProb = Object.values(data.probabilities).reduce((sum, p) => sum + p, 0);
    return Math.abs(totalProb - 100) < 0.01;
}, {
    message: "Total probabilities must sum to 100.",
    path: ["probabilities"],
});

export function SettingsClient() {
  const { settings, updateSettings } = useMatch();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    updateSettings(values);
    toast({ title: "Settings Saved", description: "Your new settings have been applied." });
  }

  function onReset() {
    form.reset(DEFAULT_SIMULATION_SETTINGS);
    updateSettings(DEFAULT_SIMULATION_SETTINGS);
    toast({ title: "Settings Reset", description: "Settings have been reset to default." });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Settings</CardTitle>
            <CardDescription>Control the speed of the match.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="ballInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ball Interval (seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Probabilities (%)</CardTitle>
            <CardDescription>Adjust the likelihood of different ball outcomes. Must sum to 100.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(settings.probabilities).map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={`probabilities.${key as keyof typeof settings.probabilities}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
           {form.formState.errors.probabilities && (
             <CardContent>
                <p className="text-sm font-medium text-destructive">{form.formState.errors.probabilities.message}</p>
             </CardContent>
            )}
        </Card>

        <div className="flex gap-4">
            <Button type="submit">Save Settings</Button>
            <Button type="button" variant="outline" onClick={onReset}>Reset to Defaults</Button>
        </div>
      </form>
    </Form>
  );
}
