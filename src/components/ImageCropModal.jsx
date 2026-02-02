import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ZoomIn, Image as ImageIcon } from 'lucide-react'
import getCroppedImg from '../utils/cropUtils'

// Aspect Ratio Options
const ASPECT_RATIOS = [
    { label: 'Free', value: null }, // Free crop
    { label: '1:1 (Square)', value: 1 / 1 },
    { label: '16:9 (Landscape)', value: 16 / 9 },
    { label: '4:3 (Standard)', value: 4 / 3 },
    { label: '3:4 (Portrait)', value: 3 / 4 },
]

export default function ImageCropModal({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete: onCropApply, // Function to call with final cropped blob
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(null) // Default to Free crop
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [loading, setLoading] = useState(false)

    const onCropChange = (crop) => setCrop(crop)
    const onZoomChange = (zoom) => setZoom(zoom)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        setLoading(true)
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
            onCropApply(croppedImage)
            onClose()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // Reset state when modal opens
    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-800">Crop Image</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={loading}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cropper Area */}
                        <div className="relative flex-1 bg-gray-900 overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect || undefined} // null means free aspect
                                onCropChange={onCropChange}
                                onCropComplete={onCropComplete}
                                onZoomChange={onZoomChange}
                                classes={{
                                    containerClassName: 'crop-container',
                                    mediaClassName: 'crop-media',
                                    cropAreaClassName: 'crop-area',
                                }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="p-6 bg-white border-t border-gray-100 space-y-6">
                            {/* Zoom Control */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <ZoomIn className="w-4 h-4" />
                                        Zoom
                                    </div>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Aspect Ratio Control */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-600">Aspect Ratio</span>
                                <div className="flex flex-wrap gap-2">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button
                                            key={ratio.label}
                                            onClick={() => setAspect(ratio.value)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${aspect === ratio.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {ratio.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Apply Crop
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
