"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polygon } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_OPTIONS } from "@/config/google-maps";
import {
  Box, Button, Typography, IconButton, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Autocomplete, Chip, CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";

export interface MapPolygonPoint { lat: number; lng: number; }
export type MapPolygon = MapPolygonPoint[];

interface Props {
  polygons: MapPolygon[];
  onChange: (p: MapPolygon[]) => void;
  disabled?: boolean;
  height?: number;
  label?: string;
}

const CENTER = { lat: 24.7136, lng: 46.6753 };
const ZOOM = 12;
export default function MapPolygonDrawer({ polygons, onChange, disabled, height = 200, label }: Props) {
  const theme = useTheme();
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<MapPolygonPoint[]>([]);
  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [myLoc, setMyLoc] = useState<MapPolygonPoint | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const tokRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      tokRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  const startDraw = useCallback(() => { setDrawing(true); setPoints([]); }, []);
  const cancelDraw = useCallback(() => { setDrawing(false); setPoints([]); }, []);
  const finishDraw = useCallback(() => {
    if (points.length < 3) return;
    onChange([...polygons, points]);
    setDrawing(false); setPoints([]);
  }, [points, polygons, onChange]);

  const delPoly = useCallback((i: number) => onChange(polygons.filter((_, idx) => idx !== i)), [polygons, onChange]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!drawing || !e.latLng) return;
    setPoints(p => [...p, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
  }, [drawing]);

  const onSearch = useCallback(async (_e: React.SyntheticEvent, v: string) => {
    setQuery(v);
    if (tRef.current) clearTimeout(tRef.current);
    if (!v || v.length < 2 || !window.google?.maps?.places) { setOpts([]); setLoading(false); return; }
    setLoading(true);
    tRef.current = setTimeout(async () => {
      try {
        const request: google.maps.places.AutocompleteRequest = {
          input: v,
          sessionToken: tokRef.current || undefined,
        };
        const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const results = await Promise.all(
          suggestions.slice(0, 5).map(async (suggestion) => {
            const placePrediction = suggestion.placePrediction;
            if (!placePrediction) return null;
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ["location"] });
            if (!place.location) return null;
            return { label: placePrediction.text.text, lat: place.location.lat(), lng: place.location.lng() };
          }),
        );
        setOpts(results.filter(Boolean) as { label: string; lat: number; lng: number }[]);
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
        setOpts([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const onSelect = useCallback((_e: React.SyntheticEvent, v: { label: string; lat: number; lng: number } | null) => {
    if (!v || !mapRef.current) return;
    mapRef.current.panTo({ lat: v.lat, lng: v.lng });
    mapRef.current.setZoom(16);
    setQuery(""); setOpts([]);
    tokRef.current = new window.google.maps.places.AutocompleteSessionToken();
  }, []);

  const onMyLoc = useCallback(() => {
    if (!mapRef.current) return;
    setLocating(true); setErr(null);
    if (!navigator.geolocation) { setLocating(false); setErr("Not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude, longitude } = p.coords;
        setMyLoc({ lat: latitude, lng: longitude });
        mapRef.current?.panTo({ lat: latitude, lng: longitude });
        mapRef.current?.setZoom(16);
        setLocating(false);
      },
      (e) => { setLocating(false); setErr(e.message || "Denied"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const paths = polygons.map(p => p.map(pt => ({ lat: pt.lat, lng: pt.lng })));
  const drawPath = points.map(pt => ({ lat: pt.lat, lng: pt.lng }));

  const renderMap = (h: number | string) => {
    if (!isLoaded) {
      return (
        <Box sx={{ height: typeof h === "number" ? `${h}px` : h, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover" }}>
          <CircularProgress size={24} />
        </Box>
      );
    }
    return (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: typeof h === "number" ? `${h}px` : h }}
        center={CENTER}
        zoom={ZOOM}
        onLoad={m => { mapRef.current = m; }}
        onClick={onMapClick}
        options={{
          mapTypeId: "roadmap",
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
          mapTypeControl: true,
          mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, position: google.maps.ControlPosition.TOP_RIGHT },
          fullscreenControl: true,
        }}
      >
        {paths.map((path, i) => (
          <Polygon key={`s${i}`} paths={path} options={{ fillColor: theme.palette.primary.main, fillOpacity: 0.15, strokeColor: theme.palette.primary.main, strokeWeight: 2, clickable: false }} />
        ))}
        {drawing && drawPath.length >= 2 && (
          <Polygon paths={drawPath} options={{ fillColor: theme.palette.success.main, fillOpacity: 0.08, strokeColor: theme.palette.success.main, strokeWeight: 2, strokeOpacity: 0.7, clickable: false }} />
        )}
        {drawing && drawPath.map((pt, i) => (
          <Marker key={`v${i}`} position={pt} icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: theme.palette.success.main, fillOpacity: 1, strokeColor: theme.palette.success.main, strokeWeight: 2 }} />
        ))}
        {myLoc && (
          <Marker position={myLoc} icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: theme.palette.error.main, fillOpacity: 0.4, strokeColor: theme.palette.error.main, strokeWeight: 2 }} />
        )}
      </GoogleMap>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {label && <Typography variant="caption" fontWeight={600} color="text.secondary">{label}</Typography>}

      <Box sx={{ height, width: "100%", borderRadius: 1.5, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, position: "relative", opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? "none" : "auto", cursor: "pointer" }} onClick={() => !disabled && setDialogOpen(true)}>
        {renderMap(height)}
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.35)", transition: "opacity 0.2s", opacity: 0, "&:hover": { opacity: 1 } }}>
          <Button variant="contained" startIcon={<MapIcon />} size="small" sx={{ color: "#fff" }}>Open Map</Button>
        </Box>
      </Box>

      {polygons.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {polygons.map((p, i) => (
            <Chip key={i} label={`Area ${i + 1} · ${p.length} pts`} size="small" onDelete={disabled ? undefined : () => delPoly(i)} sx={{ fontSize: "0.75rem" }} />
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setDrawing(false); setPoints([]); setMyLoc(null); setErr(null); }} fullWidth maxWidth="lg" sx={{ "& .MuiDialog-paper": { height: "85vh", display: "flex", flexDirection: "column"} }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MapIcon color="primary" />
            <Typography variant="h6" component="span" fontSize="1.1rem">Polygon Areas</Typography>
            {polygons.length > 0 && <Chip label={`${polygons.length} area${polygons.length > 1 ? "s" : ""}`} size="small" />}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, justifyContent: "flex-end" }}>
            <Autocomplete
              size="small"
              sx={{ minWidth: 260 }}
              value={null}
              blurOnSelect
              options={opts}
              getOptionLabel={(o: any) => typeof o === "string" ? o : o.label}
              inputValue={query}
              onInputChange={onSearch}
              onChange={onSelect}
              loading={loading}
              noOptionsText="No results"
              renderInput={(params) => (
                <TextField {...params} placeholder="Search location…" size="small" InputProps={{ ...params.InputProps, startAdornment: <SearchIcon fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} /> }} />
              )}
              filterOptions={(x) => x}
            />
            <IconButton size="small" onClick={onMyLoc} title="My location" disabled={locating}>
              {locating ? <CircularProgress size={16} /> : <MyLocationIcon fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={() => setDialogOpen(false)}><CloseIcon fontSize="small" /></IconButton>
          </Box>
        </DialogTitle>

        {err && <Box sx={{ px: 2, py: 0.75, bgcolor: "error.light" }}><Typography variant="caption" color="error.contrastText">{err}</Typography></Box>}

        <DialogContent sx={{ flex: 1, p: 0, overflow: "hidden", position: "relative" }}>
          <Box sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", alignItems: "center", gap: 1, bgcolor: "background.paper", borderRadius: 2, px: 1.5, py: 1, boxShadow: theme.shadows[4] }}>
            {!drawing ? (
              <Button size="small" startIcon={<AddIcon />} onClick={startDraw} disabled={disabled} variant="outlined">Add Area</Button>
            ) : (
              <>
                <Button size="small" startIcon={<CheckIcon />} onClick={finishDraw} disabled={disabled || points.length < 3} variant="contained">Finish</Button>
                <Button size="small" startIcon={<CloseIcon />} onClick={cancelDraw} disabled={disabled} variant="outlined" color="inherit">Cancel</Button>
                <Typography variant="caption" color="text.secondary">{points.length} point{points.length !== 1 ? "s" : ""}{points.length >= 3 && " · click Finish to close"}</Typography>
              </>
            )}
          </Box>

          {drawing && <Box sx={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 1000, bgcolor: "background.paper", borderRadius: 1, px: 1.5, py: 0.5, boxShadow: theme.shadows[2] }}><Typography variant="caption" color="text.secondary">Click map to add polygon vertices</Typography></Box>}

          {renderMap("100%")}
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          {polygons.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, flex: 1, alignItems: "center" }}>
              {polygons.map((p, i) => <Chip key={i} label={`Area ${i + 1} — ${p.length} point${p.length !== 1 ? "s" : ""}`} size="small" onDelete={disabled ? undefined : () => delPoly(i)} color="primary" variant="outlined" />)}
            </Box>
          )}
          <Button onClick={() => setDialogOpen(false)} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
