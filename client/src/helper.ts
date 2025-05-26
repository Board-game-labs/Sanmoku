export function hexToDecimal(hexStr: string): number {
    // Remove the '0x' prefix if present
    if (hexStr.startsWith('0x')) {
        hexStr = hexStr.substring(2);
    }
    
    // Convert to decimal (BigInt handles very large numbers)
    return parseInt(hexStr, 16);
}