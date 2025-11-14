import React, { useRef, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

type DraggableMarkerProps = {
  position: LatLngExpression;
  onPositionChange: (position: LatLngExpression) => void;
};

function DraggableMarker({ position, onPositionChange }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPosition = marker.getLatLng();
          onPositionChange([newPosition.lat, newPosition.lng]);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      <Popup>Déplacez-moi pour changer la position</Popup>
    </Marker>
  );
}

export default DraggableMarker;
