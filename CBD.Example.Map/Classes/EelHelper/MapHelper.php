<?php

namespace CBD\Example\Map\EelHelper;

use CBD\Example\Map\GeocodingService;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Client\InfiniteRedirectionException;
use function atan2;
use function cos;
use function pi;
use function sin;
use function sqrt;

/**
 * @Flow\Proxy(false)
 */
class MapHelper implements ProtectedContextAwareInterface
{

    /**
     * @Flow\Inject
     * @var GeocodingService
     */
    protected $geocodingService;


    /**
     * @param string $address
     * @return array|null
     * @throws InfiniteRedirectionException
     */
    public function latLngFromAddress(string $address): ?array
    {
        return $this->geocodingService->geocodeLatLonFromAddress($address);
    }

    /**
     * @param array $coords
     * @return array
     */
    public function centerFromCoordinates(array $coords): array
    {
        $count_coords = count($coords);
        $xcos = 0.0;
        $ycos = 0.0;
        $zsin = 0.0;

        foreach ($coords as $lnglat) {
            $lat = (float) $lnglat['lat'] * pi() / 180;
            $lng = (float) $lnglat['lng'] * pi() / 180;

            $acos = cos($lat) * cos($lng);
            $bcos = cos($lat) * sin($lng);
            $csin = sin($lat);
            $xcos += $acos;
            $ycos += $bcos;
            $zsin += $csin;
        }

        $xcos /= $count_coords;
        $ycos /= $count_coords;
        $zsin /= $count_coords;
        $lng = atan2($ycos, $xcos);
        $sqrt = sqrt($xcos * $xcos + $ycos * $ycos);
        $lat = atan2($zsin, $sqrt);

        return [$lat * 180 / pi(), $lng * 180 / pi()];
    }

    /**
     * @param string $methodName
     * @return bool
     */
    public function allowsCallOfMethod($methodName): bool
    {
        return true;
    }
}
