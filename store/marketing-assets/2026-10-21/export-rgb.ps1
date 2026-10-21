param(
    [string]$AssetRoot = $PSScriptRoot,
    [ValidateSet('creative', 'screenshots', 'qa')][string]$Group = 'creative'
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$jobs = if ($Group -eq 'qa') { @(
    @{ Source = 'luna-tr-poster-1206x2622.png'; Output = 'proof/poster-thumbnail-302x656.png'; Width = 302; Height = 656 },
    @{ Source = 'luna-tr-header-3840x1646.png'; Output = 'proof/header-thumbnail-960x412.png'; Width = 960; Height = 412 },
    @{ Source = 'luna-tr-search-1920x1280.png'; Output = 'proof/search-thumbnail-480x320.png'; Width = 480; Height = 320 }
) } elseif ($Group -eq 'screenshots') { @(
    @{ Source = 'references/tr-home-iphone.jpg'; Output = 'luna-tr-real-home-1206x2622.png'; Width = 1206; Height = 2622 },
    @{ Source = 'references/tr-calendar-iphone.jpg'; Output = 'luna-tr-real-calendar-1206x2622.png'; Width = 1206; Height = 2622 },
    @{ Source = 'references/tr-history-iphone.jpg'; Output = 'luna-tr-real-history-1206x2622.png'; Width = 1206; Height = 2622 }
) } else { @(
    @{ Source = 'originals/portrait-v2.png'; Output = 'luna-tr-poster-1206x2622.png'; Width = 1206; Height = 2622 },
    @{ Source = 'originals/header-v2.png'; Output = 'luna-tr-header-3840x1646.png'; Width = 3840; Height = 1646 },
    @{ Source = 'originals/search-v2.png'; Output = 'luna-tr-search-1920x1280.png'; Width = 1920; Height = 1280 }
) }
foreach ($job in $jobs) {
    $sourcePath = Join-Path $AssetRoot $job.Source
    $outputPath = Join-Path $AssetRoot $job.Output
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) { throw "Missing source: $sourcePath" }
    if (Test-Path -LiteralPath $outputPath) { throw "Refusing to overwrite: $outputPath" }
}
$results = foreach ($job in $jobs) {
    $sourcePath = Join-Path $AssetRoot $job.Source
    $outputPath = Join-Path $AssetRoot $job.Output
    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $canvas = New-Object System.Drawing.Bitmap($job.Width, $job.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $attributes = New-Object System.Drawing.Imaging.ImageAttributes
    try {
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $attributes.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
        $rectangle = New-Object System.Drawing.Rectangle(0, 0, $job.Width, $job.Height)
        $graphics.DrawImage($source, $rectangle, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
        $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        $attributes.Dispose()
        $graphics.Dispose()
        $canvas.Dispose()
        $source.Dispose()
    }
    $verified = [System.Drawing.Image]::FromFile($outputPath)
    try {
        if ($verified.Width -ne $job.Width -or $verified.Height -ne $job.Height) { throw 'Incorrect dimensions' }
        if ($verified.PixelFormat -ne [System.Drawing.Imaging.PixelFormat]::Format24bppRgb) { throw 'Not opaque RGB' }
        if ($verified.RawFormat.Guid -ne [System.Drawing.Imaging.ImageFormat]::Png.Guid) { throw 'Not PNG' }
        [pscustomobject]@{
            file = $job.Output; width = $verified.Width; height = $verified.Height
            format = 'PNG'; pixelFormat = '24-bit RGB'; alpha = $false
            bytes = (Get-Item -LiteralPath $outputPath).Length
            sha256 = (Get-FileHash -LiteralPath $outputPath -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    } finally { $verified.Dispose() }
}
$results | ConvertTo-Json -Depth 5
