import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Leaf,
  Users,
  Shield,
  Globe,
  Zap,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              Acción Ambiental Potenciada por Blockchain en Avalanche
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              La plataforma completa para{" "}
              <span className="text-emerald-500">
                rastrear el impacto ambiental
              </span>
              .
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
              Empodera a las comunidades con campañas ambientales transparentes
              y verificables. Construye confianza, rastrea el impacto y
              recompensa acciones significativas a través de tecnología
              blockchain en Avalanche C-Chain.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                >
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/get-started">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                >
                  Registrate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">500+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Campañas Activas
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-muted-foreground mt-1">
                Tasa de Transparencia
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Voluntarios
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">5x</div>
              <div className="text-sm text-muted-foreground mt-1">
                Impacto Más Rápido
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Seguimiento transparente del impacto.{" "}
              <span className="text-emerald-500">
                Herramientas para comunidades y partes interesadas.
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-2 ring-emerald-500/20">
                  <Users className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">Creación de Campañas</CardTitle>
                <CardDescription>
                  Configura campañas ambientales transparentes con métricas de
                  impacto verificables y participación comunitaria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10 ring-2 ring-emerald-400/20">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Rastreo Blockchain</CardTitle>
                <CardDescription>
                  Seguimiento en tiempo real e inmutable de todas las acciones
                  de campaña y asignación de recursos en la blockchain de
                  Avalanche.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-2 ring-emerald-500/20">
                  <Award className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">
                  Reconocimiento de Voluntarios
                </CardTitle>
                <CardDescription>
                  Gana tokens GAIA e insignias NFT a través de contribuciones
                  ambientales significativas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10 ring-2 ring-emerald-400/20">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Auditoría de Recursos</CardTitle>
                <CardDescription>
                  Visibilidad en tiempo real del uso y asignación de recursos
                  para patrocinadores y partes interesadas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 ring-2 ring-emerald-500/20">
                  <Globe className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">Comunidad Global</CardTitle>
                <CardDescription>
                  Conéctate con defensores del medio ambiente en todo el mundo a
                  través de soporte multiidioma y discusiones.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-card/50 backdrop-blur hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10 ring-2 ring-emerald-400/20">
                  <Leaf className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Informes de Impacto</CardTitle>
                <CardDescription>
                  Genera informes completos que muestran el éxito de la campaña
                  y el impacto ambiental.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              ¿Listo para hacer un{" "}
              <span className="text-emerald-500">impacto transparente</span>?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Únete a miles de comunidades que ya usan Gaia Protocol para crear
              cambio ambiental verificable en Avalanche.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/campaigns">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                >
                  Inicia Tu Campaña
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Gaia Protocol
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Acción ambiental transparente a través de la tecnología
                blockchain de Avalanche.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Plataforma</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/campaigns"
                    className="hover:text-foreground transition-colors"
                  >
                    Campañas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tracking"
                    className="hover:text-foreground transition-colors"
                  >
                    Rastreo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-foreground transition-colors"
                  >
                    Comunidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rewards"
                    className="hover:text-foreground transition-colors"
                  >
                    Recompensas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auditing"
                    className="hover:text-foreground transition-colors"
                  >
                    Auditoría
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reports"
                    className="hover:text-foreground transition-colors"
                  >
                    Reportes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Recursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-foreground transition-colors"
                  >
                    Soporte
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Compañía</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2025 GaiaProtocol. Todos los derechos reservados. Construido para
            un impacto ambiental transparente.
          </div>
        </div>
      </footer>
    </div>
  );
}
