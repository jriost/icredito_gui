'use client'

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { motion } from "framer-motion";

import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Landmark,
  BarChart3,
  Users,
  Receipt,
  PiggyBank,
  BadgePercent,
  Gem,
  AlertCircle
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import type { DashboardViewModel, KpiViewModel, CreditCardSummary, TransactionSummary } from "@/lib/definitions";
import { getDashboardData, getKpiData } from "@/lib/services/dashboard-service";


const queryClient = new QueryClient();

const DashboardPageWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardPage />
  </QueryClientProvider>
);

function KpiCard({ title, value, icon: Icon, unit = "", subtext, isLoading }: { title: string, value: string | number, icon: React.ElementType, unit?: string, subtext?: string, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : <div className="text-2xl font-bold">{value}{unit}</div>}
        {subtext && !isLoading && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  )
}

function RecentCards({ cards, isLoading }: { cards: CreditCardSummary[], isLoading: boolean }) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Tarjetas de Crédito</CardTitle>
            <CardDescription>
                Un resumen de tus tarjetas activas.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <a href="/dashboard/cards">
            Ver Todas
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </CardHeader>
      <CardContent>
         <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Tarjeta</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Saldo Actual</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                ))}
                {!isLoading && cards.map(card => (
                    <TableRow key={card.id}>
                        <TableCell>
                            <div className="font-medium">{card.brand} {card.type}</div>
                            <div className="text-sm text-muted-foreground">{card.maskedNumber}</div>
                        </TableCell>
                        <TableCell>{card.alias}</TableCell>
                        <TableCell><Badge variant={card.status === 'Active' ? 'default' : 'destructive'}>{card.status}</Badge></TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(card.balance)}</TableCell>
                    </TableRow>
                ))}
                 {!isLoading && cards.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No tienes tarjetas registradas.</TableCell></TableRow>}
            </TableBody>
         </Table>
      </CardContent>
    </Card>
  )
}

function RecentTransactions({ transactions, isLoading }: { transactions: TransactionSummary[], isLoading: boolean }) {
  return (
      <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {isLoading && Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                 <Skeleton className="h-5 w-20" />
            </div>
        ))}
        {!isLoading && transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                {transaction.type === 'Purchase' ? <CreditCard className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
            </div>
            <div className="grid gap-1 flex-1">
              <p className="text-sm font-medium leading-none">{transaction.merchantName || transaction.type}</p>
              <p className="text-xs text-muted-foreground">{transaction.description}</p>
            </div>
            <div className="ml-auto font-medium text-right">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(transaction.amount)}
                <p className="text-xs text-muted-foreground font-normal">{format(new Date(transaction.date), "dd MMM, HH:mm")}</p>
            </div>
          </div>
        ))}
        {!isLoading && transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay transacciones recientes.</p>
        )}
      </CardContent>
    </Card>
  )
}

function DashboardPage() {
    const { data: dashboardData, isLoading: isLoadingDashboard, isError: isErrorDashboard, error: errorDashboard } = useQuery<DashboardViewModel>({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData,
    });

    const { data: kpiData, isLoading: isLoadingKpi, isError: isErrorKpi, error: errorKpi } = useQuery<KpiViewModel>({
        queryKey: ["kpiData"],
        queryFn: getKpiData,
    });
    
    const isLoading = isLoadingDashboard || isLoadingKpi;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    
    const cardsByBrandConfig = React.useMemo(() => {
        if (!kpiData) return {} as ChartConfig;
        const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
        const config: ChartConfig = {};
        Object.keys(kpiData.cards.cardsByBrand).forEach((key, index) => {
            config[key] = {
                label: key.charAt(0).toUpperCase() + key.slice(1),
                color: colors[index % colors.length]
            }
        });
        return config;
    }, [kpiData]);

    const cardsByTypeConfig = React.useMemo(() => {
        if (!kpiData) return {} as ChartConfig;
        const colors = ["hsl(var(--chart-5))", "hsl(var(--chart-4))", "hsl(var(--chart-3))", "hsl(var(--chart-2))", "hsl(var(--chart-1))"];
        const config: ChartConfig = {};
        Object.keys(kpiData.cards.cardsByType).forEach((key, index) => {
            config[key] = {
                label: key.charAt(0).toUpperCase() + key.slice(1),
                color: colors[index % colors.length]
            }
        });
        return config;
    }, [kpiData]);
  
    const spendingTrendConfig = {
        thisMonth: { label: "Este Mes", color: "hsl(var(--chart-1))" },
        lastMonth: { label: "Mes Anterior", color: "hsl(var(--chart-2))" },
    } satisfies ChartConfig;
    
    if (isErrorDashboard || isErrorKpi) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2"><AlertCircle/> Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No se pudieron cargar los datos del dashboard.</p>
                        <p className="text-sm text-muted-foreground mt-2">{errorDashboard?.message || errorKpi?.message}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* KPI Cards section */}
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader>
                    <CardTitle>Resumen Financiero y de Tarjetas</CardTitle>
                    <CardDescription>Métricas clave sobre la salud financiera y el estado de tus tarjetas.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard title="Deuda Total" value={new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(kpiData?.financial.totalDebt ?? 0)} icon={DollarSign} isLoading={isLoading} />
                    <KpiCard title="Crédito Disponible" value={new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(kpiData?.financial.totalAvailableCredit ?? 0)} icon={PiggyBank} isLoading={isLoading} />
                    <KpiCard title="Utilización de Crédito" value={kpiData?.financial.creditUtilizationPercent.toFixed(2) ?? 0} unit="%" icon={BadgePercent} isLoading={isLoading} />
                    <KpiCard title="Tarjetas Activas" value={`${kpiData?.cards.activeCards ?? 0} de ${kpiData?.cards.totalCards ?? 0}`} icon={CreditCard} isLoading={isLoading} />
                </CardContent>
            </Card>
        </motion.div>

        {/* Charts section */}
        <motion.div className="grid gap-6 lg:grid-cols-3" variants={containerVariants}>
            <motion.div className="lg:col-span-2 flex flex-col gap-6" variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencia de Gastos</CardTitle>
                        <CardDescription>Comparación del gasto total entre el mes actual y el anterior.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-72 w-full"/> : (
                            <ChartContainer config={spendingTrendConfig} className="h-72 w-full">
                                <BarChart accessibilityLayer data={[ { month: 'Mes Anterior', spending: kpiData?.trends.spendingLastMonth }, { month: 'Este Mes', spending: kpiData?.trends.spendingThisMonth } ]}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                    <Bar dataKey="spending" fill="var(--color-primary)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div className="lg:col-span-1 flex flex-col gap-6" variants={itemVariants}>
                 <Card>
                  <CardHeader>
                      <CardTitle>Distribución por Marca</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {isLoading ? <Skeleton className="h-48 w-full"/> : (
                           <ChartContainer config={cardsByBrandConfig} className="mx-auto aspect-square h-[250px]">
                              <PieChart>
                                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                  <Pie data={Object.entries(kpiData?.cards.cardsByBrand || {}).map(([key, value]) => ({ name: key, value: value }))} dataKey="value" nameKey="name" />
                                  <ChartLegend content={<ChartLegendContent />} />
                              </PieChart>
                           </ChartContainer>
                      )}
                  </CardContent>
              </Card>
            </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" variants={itemVariants}>
            <RecentCards cards={dashboardData?.cards.cards ?? []} isLoading={isLoadingDashboard} />
            <div className="lg:col-span-5">
              <RecentTransactions transactions={dashboardData?.recentTransactions ?? []} isLoading={isLoadingDashboard}/>
            </div>
        </motion.div>

        </motion.div>
    );
}

export default DashboardPageWrapper;
