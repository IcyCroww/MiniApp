Add-Type -AssemblyName System.Drawing

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$puzzles = Join-Path $base 'puzzles'
$source = Join-Path $base 'source'
New-Item -ItemType Directory -Force -Path $base, $puzzles, $source | Out-Null

function Save-Png($bitmap, $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function New-TextMap($path, $title, $subtitle, $w, $h, $bg1, $bg2, $accent) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bg1, $bg2, 35)
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()

  for ($i = 0; $i -lt 12; $i++) {
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255), 1)
    $g.DrawLine($pen, 0, [int]($i * $h / 12), $w, [int]($i * $h / 12))
    $g.DrawLine($pen, [int]($i * $w / 12), 0, [int]($i * $w / 12), $h)
    $pen.Dispose()
  }

  $framePen = New-Object System.Drawing.Pen($accent, 10)
  $g.DrawRectangle($framePen, 12, 12, $w - 24, $h - 24)
  $framePen.Dispose()

  $titleFont = New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Bold)
  $subFont = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Regular)
  $smallFont = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Italic)
  $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 248, 252))
  $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 232, 241))
  $label = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 255, 244, 220))

  $g.DrawString($title, $titleFont, $white, 44, 38)
  $g.DrawString($subtitle, $subFont, $muted, 48, 96)
  $g.DrawString('Placeholder map. Replace with final art when ready.', $smallFont, $label, 48, $h - 60)

  $accentFog = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 255, 255, 255))
  $g.FillEllipse($accentFog, $w - 280, 46, 180, 180)
  $g.FillEllipse($accentFog, 80, $h - 220, 220, 120)

  $accentFog.Dispose()
  $white.Dispose()
  $muted.Dispose()
  $label.Dispose()
  $titleFont.Dispose()
  $subFont.Dispose()
  $smallFont.Dispose()
  $g.Dispose()

  Save-Png $bmp $path
}

function New-PuzzleImage($path, $guidePath, $title, $bg1, $bg2, $targetRect, $mode) {
  $w = 1400
  $h = 900

  foreach ($guide in @($false, $true)) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bg1, $bg2, 20)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    $shadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 0, 0, 0))
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 235, 235, 235), 6)

    if ($mode -eq 'doors') {
      for ($i = 0; $i -lt 3; $i++) {
        $x = 180 + ($i * 340)
        $g.FillRectangle($shadow, $x + 18, 228, 220, 470)
        $panel = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 245, 240, 232))
        $g.FillRectangle($panel, $x, 170, 220, 470)
        $g.DrawRectangle($framePen, $x, 170, 220, 470)
        $g.FillEllipse([System.Drawing.Brushes]::Goldenrod, $x + 168, 398, 18, 18)
        $panel.Dispose()
      }
    } elseif ($mode -eq 'painting') {
      $frame = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(214, 238, 226, 205))
      $artBack = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 232, 238))
      $g.FillRectangle($frame, 220, 120, 920, 610)
      $g.FillRectangle($artBack, 270, 170, 820, 510)
      $sweepPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 30, 33, 46), 18)
      $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 194, 145, 73), 26)
      $g.DrawArc($sweepPen, 330, 250, 420, 260, 12, 290)
      $g.DrawArc($goldPen, 610, 210, 280, 340, 180, 220)
      $g.FillEllipse([System.Drawing.Brushes]::Black, 510, 310, 130, 130)
      $g.FillEllipse([System.Drawing.Brushes]::WhiteSmoke, 560, 290, 80, 80)
      $frame.Dispose()
      $artBack.Dispose()
      $sweepPen.Dispose()
      $goldPen.Dispose()
    } elseif ($mode -eq 'curtain') {
      $wall = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 247, 242, 228))
      $g.FillRectangle($wall, 110, 80, 1180, 740)
      for ($i = 0; $i -lt 5; $i++) {
        $g.DrawRectangle($framePen, 120 + ($i * 70), 120 + (($i % 2) * 90), 58, 78)
      }
      $curtain = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 27, 39, 82))
      $g.FillPie($curtain, 360, 130, 440, 640, 90, 180)
      $g.FillPie($curtain, 520, 130, 440, 640, 270, 180)
      $chainPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 202, 176, 120), 8)
      $g.DrawLine($chainPen, 804, 290, 858, 566)
      $glassBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 215, 236, 232))
      $g.FillEllipse($glassBrush, 620, 320, 180, 180)
      $glassBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 130, 180, 169))
      $g.FillEllipse($glassBrush2, 668, 368, 82, 82)
      $wall.Dispose()
      $curtain.Dispose()
      $chainPen.Dispose()
      $glassBrush.Dispose()
      $glassBrush2.Dispose()
    }

    $titleFont = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Regular)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 248, 250, 252))
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 240, 240, 245))
    $g.DrawString($title, $titleFont, $textBrush, 48, 36)
    $g.DrawString('Placeholder puzzle image. Replace with final photo when ready.', $smallFont, $subBrush, 52, 78)

    if ($guide) {
      $guideBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(68, 255, 0, 0))
      $guidePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 255, 85, 85), 10)
      $g.FillEllipse($guideBrush, $targetRect.X, $targetRect.Y, $targetRect.Width, $targetRect.Height)
      $g.DrawEllipse($guidePen, $targetRect.X, $targetRect.Y, $targetRect.Width, $targetRect.Height)
      $guideBrush.Dispose()
      $guidePen.Dispose()
    }

    $shadow.Dispose()
    $framePen.Dispose()
    $titleFont.Dispose()
    $smallFont.Dispose()
    $textBrush.Dispose()
    $subBrush.Dispose()
    $g.Dispose()

    if ($guide) {
      Save-Png $bmp $guidePath
    } else {
      Save-Png $bmp $path
    }
  }
}

$maps = @(
  @{ Name = 'eleon-world-map.png'; Title = 'Eleon'; Subtitle = 'World route map'; C1 = [System.Drawing.Color]::FromArgb(255, 63, 88, 114); C2 = [System.Drawing.Color]::FromArgb(255, 146, 101, 84); A = [System.Drawing.Color]::FromArgb(255, 244, 222, 190); W = 1600; H = 980 },
  @{ Name = 'valemor-map.png'; Title = 'Valemor'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 116, 63, 49); C2 = [System.Drawing.Color]::FromArgb(255, 188, 122, 88); A = [System.Drawing.Color]::FromArgb(255, 244, 208, 168); W = 1400; H = 900 },
  @{ Name = 'sen-alden-map.png'; Title = 'Sen-Alden'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 60, 91, 122); C2 = [System.Drawing.Color]::FromArgb(255, 106, 157, 182); A = [System.Drawing.Color]::FromArgb(255, 220, 238, 246); W = 1400; H = 900 },
  @{ Name = 'bellerosh-map.png'; Title = 'Bellerosh'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 92, 76, 64); C2 = [System.Drawing.Color]::FromArgb(255, 166, 132, 101); A = [System.Drawing.Color]::FromArgb(255, 244, 219, 182); W = 1400; H = 900 },
  @{ Name = 'montelier-map.png'; Title = 'Montelier'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 74, 97, 59); C2 = [System.Drawing.Color]::FromArgb(255, 144, 165, 106); A = [System.Drawing.Color]::FromArgb(255, 230, 243, 214); W = 1400; H = 900 },
  @{ Name = 'verdal-map.png'; Title = 'Verdal'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 63, 78, 126); C2 = [System.Drawing.Color]::FromArgb(255, 121, 137, 187); A = [System.Drawing.Color]::FromArgb(255, 227, 233, 252); W = 1400; H = 900 },
  @{ Name = 'sent-loren-map.png'; Title = 'Sent-Loren'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 89, 53, 64); C2 = [System.Drawing.Color]::FromArgb(255, 147, 94, 106); A = [System.Drawing.Color]::FromArgb(255, 245, 220, 226); W = 1400; H = 900 },
  @{ Name = 'lavier-map.png'; Title = 'Lavier'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 104, 56, 70); C2 = [System.Drawing.Color]::FromArgb(255, 179, 102, 126); A = [System.Drawing.Color]::FromArgb(255, 252, 221, 230); W = 1400; H = 900 },
  @{ Name = 'ardenval-map.png'; Title = 'Ardenval'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 59, 78, 90); C2 = [System.Drawing.Color]::FromArgb(255, 112, 139, 151); A = [System.Drawing.Color]::FromArgb(255, 226, 238, 243); W = 1400; H = 900 },
  @{ Name = 'castreville-map.png'; Title = 'Castreville'; Subtitle = 'City map'; C1 = [System.Drawing.Color]::FromArgb(255, 120, 86, 51); C2 = [System.Drawing.Color]::FromArgb(255, 205, 145, 84); A = [System.Drawing.Color]::FromArgb(255, 252, 233, 198); W = 1400; H = 900 }
)

foreach ($map in $maps) {
  New-TextMap (Join-Path $base $map.Name) $map.Title $map.Subtitle $map.W $map.H $map.C1 $map.C2 $map.A
}

New-PuzzleImage (Join-Path $puzzles 'valemor-ministry-door.png') (Join-Path $puzzles 'valemor-ministry-door-guide.png') 'Valemor: right door' ([System.Drawing.Color]::FromArgb(255, 212, 207, 201)) ([System.Drawing.Color]::FromArgb(255, 166, 150, 129)) (New-Object System.Drawing.Rectangle 570, 270, 260, 440) 'doors'
New-PuzzleImage (Join-Path $puzzles 'valemor-museum-painting.png') (Join-Path $puzzles 'valemor-museum-painting-guide.png') 'Valemor: museum painting' ([System.Drawing.Color]::FromArgb(255, 40, 43, 55)) ([System.Drawing.Color]::FromArgb(255, 122, 104, 82)) (New-Object System.Drawing.Rectangle 455, 260, 280, 240) 'painting'
New-PuzzleImage (Join-Path $puzzles 'sen-alden-art-nouveau.png') (Join-Path $puzzles 'sen-alden-art-nouveau-guide.png') 'Sen-Alden: hidden detail' ([System.Drawing.Color]::FromArgb(255, 182, 172, 155)) ([System.Drawing.Color]::FromArgb(255, 79, 97, 142)) (New-Object System.Drawing.Rectangle 525, 285, 360, 360) 'curtain'

$testFile = Join-Path $base 'test.png'
if (Test-Path $testFile) {
  Remove-Item $testFile -Force
}

Write-Output 'ELEON_ASSETS_READY'
