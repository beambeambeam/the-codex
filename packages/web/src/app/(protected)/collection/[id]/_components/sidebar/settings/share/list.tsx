import { useParams } from "next/navigation";
import { AlertCircle, Crown, Shield, UserIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Scroller } from "@/components/ui/scroller";
import { Skeleton } from "@/components/ui/skeleton";
import { $api } from "@/lib/api/client";
import { components } from "@/lib/api/path";

type UserPermission = components["schemas"]["UserPermissionResponse"];

function PermissionItem({ permission }: { permission: UserPermission }) {
  const getPermissionIcon = (level: UserPermission["permission_level"]) => {
    switch (level) {
      case "owner":
        return <Crown className="h-3 w-3" />;
      case "edit":
        return <Shield className="h-3 w-3" />;
      default:
        return <UserIcon className="h-3 w-3" />;
    }
  };

  const getPermissionVariant = (level: UserPermission["permission_level"]) => {
    switch (level) {
      case "owner":
        return "destructive" as const;
      case "edit":
        return "default" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={permission.username} />
          <AvatarFallback>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-medium">
              {permission.username}
            </h4>
          </div>
          <p className="text-muted-foreground truncate text-xs">
            {permission.email}
          </p>
          <p className="text-muted-foreground text-xs">
            Granted by {permission.granter_username}
          </p>
        </div>
        <Badge
          variant={getPermissionVariant(permission.permission_level)}
          className="flex items-center gap-1"
        >
          {getPermissionIcon(permission.permission_level)}
          {permission.permission_level}
        </Badge>
      </CardContent>
    </Card>
  );
}

function ShareList() {
  const params = useParams<{ id: string }>();

  const { data, isPending, isError, error } = $api.useQuery(
    "get",
    "/collections/{collection_id}/permissions",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  if (isPending) {
    return (
      <Scroller className="h-full">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card className="mb-3" key={index}>
                <CardContent className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Scroller>
    );
  }

  if (isError) {
    return (
      <Scroller className="h-full">
        <div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load permissions. Please try again later.
              {error && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </Scroller>
    );
  }

  const permissions = data as UserPermission[];

  if (!permissions || permissions.length === 0) {
    return (
      <Scroller className="h-full">
        <div>
          <div className="py-8 text-center">
            <UserIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-muted-foreground mb-2 text-lg font-medium">
              No permissions found
            </h3>
            <p className="text-muted-foreground text-sm">
              This collection doesn&apos;t have any shared permissions yet.
            </p>
          </div>
        </div>
      </Scroller>
    );
  }

  return (
    <Scroller className="h-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Shared Permissions</h3>
          <p className="text-muted-foreground text-sm">
            {permissions.length} user{permissions.length !== 1 ? "s" : ""} have
            access to this collection
          </p>
        </div>
        <div className="space-y-3">
          {permissions.map((permission) => (
            <PermissionItem key={permission.id} permission={permission} />
          ))}
        </div>
      </div>
    </Scroller>
  );
}

export default ShareList;
