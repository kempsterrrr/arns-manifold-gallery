interface AsciiArtDisplayProps {
  asciiArt: string;
}

export function AsciiArtDisplay({ asciiArt }: AsciiArtDisplayProps) {
  // Analyze ASCII art dimensions
  const lines = asciiArt.split('\n');
  const maxWidth = Math.max(...lines.map(line => line.length));

  // Check for Unicode block characters (complex art)
  const hasComplexChars = /[█▌▐▀▄▒░]/.test(asciiArt);

  // Determine size category based on width and complexity
  let sizeClasses = "";

  if (maxWidth > 100 || hasComplexChars) {
    // Large/complex art - use smallest font sizes
    sizeClasses = "text-[4px] xs:text-[5px] sm:text-[6px] md:text-[4px] lg:text-[5px] xl:text-[6px]";
  } else if (maxWidth > 70) {
    // Medium art - use medium font sizes
    sizeClasses = "text-[6px] xs:text-[7px] sm:text-[8px] md:text-[6px] lg:text-[7px] xl:text-[8px]";
  } else {
    // Small/simple art - use larger font sizes for better impact
    sizeClasses = "text-[8px] xs:text-[10px] sm:text-[12px] md:text-[8px] lg:text-[10px] xl:text-[12px]";
  }

  return (
    <div className="mb-2">
      <pre className={`${sizeClasses} font-mono text-white whitespace-pre leading-[0.8] overflow-hidden max-w-full max-h-[400px] inline-block mx-auto`}>
        {asciiArt}
      </pre>
    </div>
  );
}