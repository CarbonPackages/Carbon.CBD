<?php

namespace CBD\Example\Map\Service;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Http\Client\Browser;
use Neos\Flow\Http\Client\CurlEngine;
use Neos\Flow\Http\Client\InfiniteRedirectionException;

/**
 * @Flow\Scope("singleton")
 */
class GeocodingService
{

    /**
     * @param NodeInterface $node
     * @param string $propertyName
     * @param string|null $oldValue
     * @param string|null $value
     * @throws InfiniteRedirectionException
     */
    public function nodePropertyChanged(
        NodeInterface $node,
        string $propertyName,
        ?string $oldValue = null,
        ?string $value = null
    ): void {
        if (
            $node->getNodeType()->isOfType('CBD.Example.Map:Content.Map.Address') &&
            ($propertyName == 'street' || $propertyName == 'postCode' || $propertyName == 'city' || $propertyName == 'country')
        ) {
            $node->setProperty('lat', '');
            $node->setProperty('lng', '');

            if (empty($value)) {
                return;
            }


            $street = $node->getProperty('street');
            $postCode = $node->getProperty('postCode');
            $city = $node->getProperty('city');
            $country = $node->getProperty('country');
            $address = "$street, $postCode $city, $country";
            $latLng = $this->geocodeLatLngFromAddress($address);
            if ($latLng) {
                $node->setProperty('lat', $latLng['lat']);
                $node->setProperty('lng', $latLng['lng']);
            }
        }
    }

    /**
     * @param string $address
     * @return array|null
     * @throws InfiniteRedirectionException
     */
    public function geocodeLatLngFromAddress(string $address): ?array
    {
        $url = 'https://nominatim.openstreetmap.org/search?q=' . urlencode($address) . '&limit=1&format=json&addressdetails=1';

        $browser = new Browser();
        $browser->setRequestEngine(new CurlEngine());
        $response = $browser->request($url);
        $jsonContent = $response->getBody();

        if ($jsonContent) {
            $json = json_decode($jsonContent, true);
            if (isset($json[0]) && isset($json[0]['lat']) && isset($json[0]['lon'])) {
                return [
                    'lat' => $json[0]['lat'],
                    'lng' => $json[0]['lon'],
                ];
            }
        }

        return null;
    }
}
