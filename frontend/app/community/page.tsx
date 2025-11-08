"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Heart,
  MessageSquare,
  Eye,
  Pin,
  Star,
} from "lucide-react";
import Link from "next/link";

// Datos simulados de la comunidad
const communityStats = {
  totalMembers: 15847,
  activeDiscussions: 234,
  monthlyPosts: 1289,
  helpfulAnswers: 892,
};

const trendingTopics = [
  { id: 1, name: "Limpieza Oceánica", posts: 45, trend: "+12%" },
  { id: 2, name: "Jardinería Urbana", posts: 38, trend: "+8%" },
  { id: 3, name: "Energía Renovable", posts: 32, trend: "+15%" },
  { id: 4, name: "Reducción de Residuos", posts: 28, trend: "+5%" },
];

const discussions = [
  {
    id: 1,
    title: "Mejores prácticas para organizar eventos de limpieza de playas",
    content:
      "Estoy planeando organizar una limpieza de playa en mi área local y me encantaría escuchar de organizadores experimentados sobre mejores prácticas, consideraciones de seguridad y cómo maximizar el impacto.",
    author: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.8,
      level: "Campeona Eco",
    },
    category: "Organización",
    tags: ["limpieza-playa", "organización", "seguridad"],
    createdAt: "2025-01-14T10:30:00Z",
    replies: 23,
    views: 156,
    likes: 45,
    isPinned: true,
    isAnswered: false,
  },
  {
    id: 2,
    title:
      "¿Cómo medir con precisión el impacto de CO2 en campañas de plantación de árboles?",
    content:
      "Estamos ejecutando una campaña de plantación de árboles y queremos asegurar que nuestros cálculos de impacto de CO2 sean precisos. ¿Qué metodologías recomiendan para medir y verificar el impacto ambiental?",
    author: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.9,
      level: "Líder de Impacto",
    },
    category: "Medición de Impacto",
    tags: ["co2", "medición", "árboles", "verificación"],
    createdAt: "2025-01-13T15:45:00Z",
    replies: 18,
    views: 203,
    likes: 67,
    isPinned: false,
    isAnswered: true,
  },
  {
    id: 3,
    title: "Proceso de verificación blockchain - preguntas técnicas",
    content:
      "¿Alguien puede explicar cómo funciona la verificación blockchain para las acciones de campaña? Tengo curiosidad sobre la implementación técnica y cómo garantiza la transparencia.",
    author: {
      name: "Ana Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.6,
      level: "Defensora Tecnológica",
    },
    category: "Tecnología",
    tags: ["blockchain", "verificación", "técnico"],
    createdAt: "2025-01-13T09:20:00Z",
    replies: 31,
    views: 289,
    likes: 89,
    isPinned: false,
    isAnswered: true,
  },
  {
    id: 4,
    title: "Materiales sostenibles para suministros de campaña",
    content:
      "Busco recomendaciones sobre materiales sostenibles y proveedores para equipos de campaña como guantes, bolsas y herramientas. ¿Qué ha funcionado bien para sus campañas?",
    author: {
      name: "Diego Lopez",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.4,
      level: "Innovador Verde",
    },
    category: "Recursos",
    tags: ["sostenible", "materiales", "suministros"],
    createdAt: "2025-01-12T14:10:00Z",
    replies: 12,
    views: 98,
    likes: 34,
    isPinned: false,
    isAnswered: false,
  },
];

const categories = [
  { id: "all", name: "Todas las Discusiones", count: 234 },
  { id: "organization", name: "Organización", count: 67 },
  { id: "impact", name: "Medición de Impacto", count: 45 },
  { id: "technology", name: "Tecnología", count: 38 },
  { id: "resources", name: "Recursos", count: 42 },
  { id: "success-stories", name: "Historias de Éxito", count: 28 },
  { id: "help", name: "Ayuda y Soporte", count: 14 },
];

const topContributors = [
  {
    name: "Carlos Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 89,
    helpfulAnswers: 67,
    reputation: 4.9,
  },
  {
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 76,
    helpfulAnswers: 54,
    reputation: 4.8,
  },
  {
    name: "Ana Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 63,
    helpfulAnswers: 41,
    reputation: 4.6,
  },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesCategory =
      selectedCategory === "all" ||
      discussion.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Justo ahora";
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Centro de Comunidad
            </h1>
            <p className="text-muted-foreground mt-2">
              Conecta, comparte conocimiento y colabora con defensores
              ambientales en todo el mundo
            </p>
          </div>
          <Button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-tracky-primary hover:bg-tracky-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Discusión
          </Button>
        </div>

        {/* Community Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Miembros de la Comunidad
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tracky-primary">
                {communityStats.totalMembers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Discusiones Activas
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tracky-secondary">
                {communityStats.activeDiscussions}
              </div>
              <p className="text-xs text-muted-foreground">
                +8 nuevas esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Publicaciones Mensuales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tracky-primary">
                {communityStats.monthlyPosts}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% de incremento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Respuestas Útiles
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tracky-secondary">
                {communityStats.helpfulAnswers}
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-tracky-primary/10 text-tracky-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.count}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temas en Tendencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {topic.posts} publicaciones
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-tracky-secondary/10 text-tracky-secondary"
                    >
                      {topic.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Principales Contribuyentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={contributor.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {contributor.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.posts} publicaciones •{" "}
                        {contributor.helpfulAnswers} útiles
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{contributor.reputation}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Post Form */}
            {showNewPostForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Start a New Discussion</CardTitle>
                  <CardDescription>
                    Share your thoughts, ask questions, or start a conversation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Discussion title..."
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organization">
                          Organization
                        </SelectItem>
                        <SelectItem value="impact">
                          Impact Measurement
                        </SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="resources">Resources</SelectItem>
                        <SelectItem value="success-stories">
                          Success Stories
                        </SelectItem>
                        <SelectItem value="help">Help & Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share your thoughts, ask questions, or provide details..."
                      className="min-h-32 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Tags (comma separated)" />
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-tracky-primary hover:bg-tracky-primary/90 text-white">
                      Publicar Discusión
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar discusiones..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más Recientes</SelectItem>
                  <SelectItem value="popular">Más Populares</SelectItem>
                  <SelectItem value="answered">Respondidas</SelectItem>
                  <SelectItem value="unanswered">Sin Responder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <Card
                  key={discussion.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {discussion.isPinned && (
                              <Pin className="h-4 w-4 text-tracky-primary" />
                            )}
                            <Link
                              href={`/community/discussions/${discussion.id}`}
                              className="text-lg font-semibold hover:text-tracky-primary transition-colors"
                            >
                              {discussion.title}
                            </Link>
                            {discussion.isAnswered && (
                              <Badge
                                variant="secondary"
                                className="bg-tracky-secondary/10 text-tracky-secondary"
                              >
                                Respondida
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-2">
                            {discussion.content}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Separator />

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                discussion.author.avatar || "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {discussion.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {discussion.author.name}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {discussion.author.level}
                              </Badge>
                              <span>{formatTimeAgo(discussion.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {discussion.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {discussion.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {discussion.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Cargar Más Discusiones
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
