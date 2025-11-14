import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import DraggableMarker from "@/components/common/map-field/draggable-marker";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
  iconSize: [25, 41], // Taille de l'icône
  iconAnchor: [12, 41], // Point d'ancrage (bas au centre)
  popupAnchor: [1, -34], // Ancre pour les popups
  shadowSize: [41, 41], // Taille de l'ombre
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (position: LatLngExpression) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function LeafletMap({
  position,
  zoom,
  markerPosition,
  onMapClick,
}: {
  position: LatLngExpression;
  zoom: number;
  markerPosition: LatLngExpression | null;
  onMapClick: (position: LatLngExpression) => void;
}) {
  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markerPosition && (
        <DraggableMarker
          position={markerPosition}
          onPositionChange={onMapClick}
        />
      )}
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}

export default LeafletMap;
