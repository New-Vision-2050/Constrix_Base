"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMapEvents,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import {
  Box,
  Button,
  Typography,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export interface MapPolygonPoint {
  lat: number;
  lng: number;
}

export type MapPolygon = MapPolygonPoint[];

interface MapPolygonDrawerProps {
  polygons: MapPolygon[];
  onChange: (polygons: MapPolygon[]) => void;
  disabled?: boolean;
  height?: number;
  label?: string;
}

const DEFAULT_CENTER: L.LatLngExpression = [24.7136, 46.6753];
const DEFAULT_ZOOM = 12;

const searchProvider = new OpenStreetMapProvider();

function MapClickHandler({
  onClick,
  disabled,
}: {
  onClick: (lat: number, lng: number) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (!disabled) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ onReady }: { onReady?: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    if (onReady) onReady(map);
  }, [map, onReady]);

  return null;
}

interface SearchResultItem {
  label: string;
  lat: number;
  lng: number;
}

export default function MapPolygonDrawer({
  polygons,
  onChange,
  disabled = false,
  height = 200,
  label,
}: MapPolygonDrawerProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<MapPolygonPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState<SearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapPolygonPoint | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const polygonColor = theme.palette.primary.main;
  const drawingColor = theme.palette.success.main;

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    setDrawingPoints([]);
  }, []);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawingPoints([]);
  }, []);

  const finishPolygon = useCallback(() => {
    if (drawingPoints.length < 3) return;
    onChange([...polygons, drawingPoints]);
    setIsDrawing(false);
    setDrawingPoints([]);
  }, [drawingPoints, polygons, onChange]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!isDrawing || disabled) return;
      setDrawingPoints((prev) => [...prev, { lat, lng }]);
    },
    [isDrawing, disabled],
  );

  const deletePolygon = useCallback(
    (index: number) => {
      const next = polygons.filter((_, i) => i !== index);
      onChange(next);
    },
    [polygons, onChange],
  );

  const handleSearchInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setSearchQuery(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (!value || value.length < 2) {
        setSearchOptions([]);
        setSearchLoading(false);
        return;
      }
      setSearchLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchProvider.search({ query: value });
          setSearchOptions(
            results.map((r) => ({
              label: r.label,
              lat: r.y,
              lng: r.x,
            })),
          );
        } catch {
          setSearchOptions([]);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    },
    [],
  );

  const handleSearchSelect = useCallback(
    (_event: React.SyntheticEvent, value: SearchResultItem | null) => {
      if (!value || !mapRef.current) return;
      mapRef.current.flyTo([value.lat, value.lng], 15, {
        duration: 1.5,
      });
      setSearchQuery("");
      setSearchOptions([]);
    },
    [],
  );

  const handleFlyToCurrent = useCallback(() => {
    if (!mapRef.current) return;
    setLocating(true);
    setGeoError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          mapRef.current?.flyTo([latitude, longitude], 16, { duration: 1.5 });
          setLocating(false);
        },
        (err) => {
          setLocating(false);
          setGeoError(err.message || "Location access denied");
          if (polygons.length > 0 && polygons[0].length > 0) {
            const first = polygons[0][0];
            mapRef.current?.flyTo([first.lat, first.lng], 15, { duration: 1.5 });
          } else {
            mapRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setLocating(false);
      setGeoError("Geolocation not supported");
      if (polygons.length > 0 && polygons[0].length > 0) {
        const first = polygons[0][0];
        mapRef.current.flyTo([first.lat, first.lng], 15, { duration: 1.5 });
      } else {
        mapRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
      }
    }
  }, [polygons]);

  const drawingLinePositions = useMemo(
    (): [number, number][] => drawingPoints.map((p) => [p.lat, p.lng]),
    [drawingPoints],
  );

  const renderMapContent = (mapHeight: number | string) => (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: typeof mapHeight === "number" ? `${mapHeight}px` : mapHeight, width: "100%" }}
      zoomControl={false}
    >
      <MapController onReady={(map) => { mapRef.current = map; }} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="&copy; Google Maps"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {currentLocation && (
        <CircleMarker
          key="current-location"
          center={[currentLocation.lat, currentLocation.lng]}
          radius={8}
          pathOptions={{
            color: theme.palette.error.main,
            fillColor: theme.palette.error.main,
            fillOpacity: 0.4,
            weight: 2,
          }}
        />
      )}

      <MapClickHandler onClick={handleMapClick} disabled={!isDrawing || disabled} />

      {polygons.map((polygon, idx) => (
        <Polygon
          key={`poly-${idx}`}
          positions={polygon.map((p): [number, number] => [p.lat, p.lng])}
          pathOptions={{
            color: polygonColor,
            fillColor: polygonColor,
            fillOpacity: 0.15,
            weight: 2,
          }}
        />
      ))}

      {isDrawing && drawingPoints.length >= 2 && (
        <Polyline
          positions={drawingLinePositions}
          pathOptions={{ color: drawingColor, weight: 2, dashArray: "6 4" }}
        />
      )}

      {isDrawing &&
        drawingPoints.map((point, idx) => (
          <CircleMarker
            key={`vertex-${idx}`}
            center={[point.lat, point.lng]}
            radius={5}
            pathOptions={{
              color: drawingColor,
              fillColor: drawingColor,
              fillOpacity: 1,
              weight: 2,
            }}
          />
        ))}

      {isDrawing && drawingPoints.length >= 2 && (
        <Polyline
          positions={[
            [drawingPoints[drawingPoints.length - 1].lat, drawingPoints[drawingPoints.length - 1].lng],
            [drawingPoints[0].lat, drawingPoints[0].lng],
          ]}
          pathOptions={{
            color: drawingColor,
            weight: 1,
            dashArray: "3 6",
            opacity: 0.5,
          }}
        />
      )}
    </MapContainer>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {label && (
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {label}
        </Typography>
      )}

      {/* Inline preview */}
      <Box
        sx={{
          height,
          width: "100%",
          borderRadius: 1.5,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          position: "relative",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
          cursor: "pointer",
        }}
        onClick={() => !disabled && setDialogOpen(true)}
      >
        {renderMapContent(height)}

        {/* Overlay button to open full editor */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.35)",
            transition: "opacity 0.2s",
            opacity: 0,
            "&:hover": { opacity: 1 },
          }}
        >
          <Button
            variant="contained"
            startIcon={<MapIcon />}
            size="small"
            sx={{ color: "#fff" }}
          >
            Open Map
          </Button>
        </Box>
      </Box>

      {/* Polygon chips summary */}
      {polygons.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {polygons.map((polygon, idx) => (
            <Chip
              key={idx}
              label={`Area ${idx + 1} · ${polygon.length} pts`}
              size="small"
              onDelete={disabled ? undefined : () => deletePolygon(idx)}
              sx={{ fontSize: "0.75rem" }}
            />
          ))}
        </Box>
      )}

      {/* Full-screen editor dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setIsDrawing(false);
          setDrawingPoints([]);
          setCurrentLocation(null);
          setGeoError(null);
        }}
        fullWidth
        maxWidth="lg"
        sx={{ "& .MuiDialog-paper": { height: "85vh", display: "flex", flexDirection: "column" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MapIcon color="primary" />
            <Typography variant="h6" component="span" fontSize="1.1rem">
              Polygon Areas
            </Typography>
            {polygons.length > 0 && (
              <Chip label={`${polygons.length} area${polygons.length > 1 ? "s" : ""}`} size="small" />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, justifyContent: "flex-end" }}>
            {/* Search */}
            <Autocomplete
              size="small"
              sx={{ minWidth: 260 }}
              value={null}
              freeSolo
              blurOnSelect
              options={searchOptions}
              getOptionLabel={(o) => (typeof o === "string" ? o : o.label)}
              inputValue={searchQuery}
              onInputChange={handleSearchInputChange}
              onChange={handleSearchSelect}
              loading={searchLoading}
              noOptionsText="No results"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search location…"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                    ),
                  }}
                />
              )}
              filterOptions={(x) => x}
            />

            <IconButton size="small" onClick={handleFlyToCurrent} title="My location" disabled={locating}>
              {locating ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                  }}
                />
              ) : (
                <MyLocationIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton size="small" onClick={() => setDialogOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        {geoError && (
          <Box sx={{ px: 2, py: 0.75, bgcolor: "error.light" }}>
            <Typography variant="caption" color="error.contrastText">
              {geoError}
            </Typography>
          </Box>
        )}

        <DialogContent sx={{ flex: 1, p: 0, overflow: "hidden", position: "relative" }}>
          {/* Toolbar */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              px: 1.5,
              py: 1,
              boxShadow: theme.shadows[4],
            }}
          >
            {!isDrawing ? (
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={startDrawing}
                disabled={disabled}
                variant="outlined"
              >
                Add Area
              </Button>
            ) : (
              <>
                <Button
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={finishPolygon}
                  disabled={disabled || drawingPoints.length < 3}
                  variant="contained"
                >
                  Finish
                </Button>
                <Button
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={cancelDrawing}
                  disabled={disabled}
                  variant="outlined"
                  color="inherit"
                >
                  Cancel
                </Button>
                <Typography variant="caption" color="text.secondary">
                  {drawingPoints.length} point{drawingPoints.length !== 1 ? "s" : ""}
                  {drawingPoints.length >= 3 && " · click Finish to close"}
                </Typography>
              </>
            )}
          </Box>

          {/* Hint when drawing */}
          {isDrawing && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                bgcolor: "background.paper",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Click map to add polygon vertices
              </Typography>
            </Box>
          )}

          {renderMapContent("100%")}
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          {/* Polygon list in dialog footer */}
          {polygons.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, flex: 1, alignItems: "center" }}>
              {polygons.map((polygon, idx) => (
                <Chip
                  key={idx}
                  label={`Area ${idx + 1} — ${polygon.length} point${polygon.length !== 1 ? "s" : ""}`}
                  size="small"
                  onDelete={disabled ? undefined : () => deletePolygon(idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
