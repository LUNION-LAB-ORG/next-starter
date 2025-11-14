"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import type { LatLngExpression } from "leaflet";

function MapField({
  position = [5.345317, -4.024429],
  zoom = 13,
  onPositionChange,
}: {
  position?: LatLngExpression;
  zoom?: number;
  onPositionChange?: (position: LatLngExpression) => void;
  markerPosition?: LatLngExpression;
}) {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    position,
  );

  const Map = React.useMemo(
    () =>
      dynamic(() => import("@/components/common/map-field/leaflet-map"), {
        loading: () => <Loader className="animate-spin" />,
        ssr: false,
      }),
    [],
  );

  const handleMapClick = (newPosition: LatLngExpression) => {
    setMarkerPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  return (
    <Map
      position={position}
      zoom={zoom}
      markerPosition={markerPosition}
      onMapClick={handleMapClick}
    />
  );
}

export default MapField;
