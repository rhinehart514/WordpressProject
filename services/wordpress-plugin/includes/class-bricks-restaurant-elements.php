<?php
/**
 * Bricks Restaurant Elements
 * Reusable element templates for restaurant websites
 */

class Bricks_Restaurant_Elements {

    /**
     * Generate unique element ID
     */
    private static function generate_id($prefix = 'el') {
        return $prefix . '_' . uniqid();
    }

    /**
     * Create a container element
     */
    public static function container($children = [], $settings = []) {
        return [
            'id' => self::generate_id('container'),
            'name' => 'container',
            'settings' => array_merge([
                'tag' => 'div',
            ], $settings),
            'children' => $children,
        ];
    }

    /**
     * Create a heading element
     */
    public static function heading($text, $tag = 'h2', $classes = []) {
        return [
            'id' => self::generate_id('heading'),
            'name' => 'heading',
            'settings' => [
                'text' => $text,
                'tag' => $tag,
                '_cssClasses' => $classes,
            ],
        ];
    }

    /**
     * Create a text element
     */
    public static function text($content, $classes = []) {
        return [
            'id' => self::generate_id('text'),
            'name' => 'text-basic',
            'settings' => [
                'text' => $content,
                '_cssClasses' => $classes,
            ],
        ];
    }

    /**
     * Create an image element
     */
    public static function image($url, $alt = '', $classes = []) {
        return [
            'id' => self::generate_id('image'),
            'name' => 'image',
            'settings' => [
                'image' => [
                    'url' => $url,
                    'alt' => $alt,
                ],
                '_cssClasses' => $classes,
            ],
        ];
    }

    /**
     * Create a button element
     */
    public static function button($text, $link, $classes = []) {
        return [
            'id' => self::generate_id('button'),
            'name' => 'button',
            'settings' => [
                'text' => $text,
                'link' => ['url' => $link],
                '_cssClasses' => $classes,
            ],
        ];
    }

    /**
     * Create a hero section
     */
    public static function hero_section($data) {
        return [
            'id' => self::generate_id('hero'),
            'name' => 'section',
            'settings' => [
                '_cssClasses' => ['restaurant-hero'],
                '_background' => [
                    'image' => ['url' => $data['hero_image']],
                    'overlay' => ['color' => 'rgba(0,0,0,0.3)'],
                ],
                '_padding' => [
                    'top' => '100px',
                    'bottom' => '100px',
                ],
            ],
            'children' => [
                self::container([
                    self::heading($data['name'], 'h1', ['hero-title']),
                    self::text($data['tagline'] ?? '', ['hero-tagline']),
                    self::button('View Menu', '#menu', ['cta-button']),
                ]),
            ],
        ];
    }

    /**
     * Create a menu item element
     */
    public static function menu_item($item) {
        $children = [
            self::heading($item['name'], 'h3', ['menu-item-name']),
        ];

        if (!empty($item['description'])) {
            $children[] = self::text($item['description'], ['menu-item-description']);
        }

        if (!empty($item['price'])) {
            $children[] = self::text($item['price'], ['menu-item-price']);
        }

        if (!empty($item['image'])) {
            array_unshift($children, self::image($item['image'], $item['name'], ['menu-item-image']));
        }

        return [
            'id' => self::generate_id('menu_item'),
            'name' => 'div',
            'settings' => [
                '_cssClasses' => ['menu-item'],
            ],
            'children' => $children,
        ];
    }

    /**
     * Create a menu section
     */
    public static function menu_section($menu_items, $title = 'Our Menu') {
        $menu_elements = [];
        foreach ($menu_items as $item) {
            $menu_elements[] = self::menu_item($item);
        }

        return [
            'id' => self::generate_id('menu'),
            'name' => 'section',
            'settings' => [
                '_cssClasses' => ['menu-section'],
                '_padding' => [
                    'top' => '80px',
                    'bottom' => '80px',
                ],
            ],
            'children' => [
                self::container([
                    self::heading($title, 'h2', ['section-title']),
                    [
                        'id' => self::generate_id('menu_grid'),
                        'name' => 'div',
                        'settings' => [
                            '_cssClasses' => ['menu-grid'],
                        ],
                        'children' => $menu_elements,
                    ],
                ]),
            ],
        ];
    }

    /**
     * Create a gallery section
     */
    public static function gallery_section($images, $title = 'Gallery') {
        $gallery_elements = [];
        foreach ($images as $image_url) {
            $gallery_elements[] = self::image($image_url, '', ['gallery-item']);
        }

        return [
            'id' => self::generate_id('gallery'),
            'name' => 'section',
            'settings' => [
                '_cssClasses' => ['gallery-section'],
                '_padding' => [
                    'top' => '80px',
                    'bottom' => '80px',
                ],
            ],
            'children' => [
                self::container([
                    self::heading($title, 'h2', ['section-title']),
                    [
                        'id' => self::generate_id('gallery_grid'),
                        'name' => 'div',
                        'settings' => [
                            '_cssClasses' => ['gallery-grid'],
                        ],
                        'children' => $gallery_elements,
                    ],
                ]),
            ],
        ];
    }

    /**
     * Create a contact section
     */
    public static function contact_section($data) {
        $contact_items = [];

        if (!empty($data['address'])) {
            $contact_items[] = [
                'id' => self::generate_id('address'),
                'name' => 'div',
                'settings' => ['_cssClasses' => ['contact-item']],
                'children' => [
                    self::heading('Address', 'h3', ['contact-label']),
                    self::text($data['address'], ['contact-value']),
                ],
            ];
        }

        if (!empty($data['phone'])) {
            $contact_items[] = [
                'id' => self::generate_id('phone'),
                'name' => 'div',
                'settings' => ['_cssClasses' => ['contact-item']],
                'children' => [
                    self::heading('Phone', 'h3', ['contact-label']),
                    self::text($data['phone'], ['contact-value']),
                ],
            ];
        }

        if (!empty($data['email'])) {
            $contact_items[] = [
                'id' => self::generate_id('email'),
                'name' => 'div',
                'settings' => ['_cssClasses' => ['contact-item']],
                'children' => [
                    self::heading('Email', 'h3', ['contact-label']),
                    self::text($data['email'], ['contact-value']),
                ],
            ];
        }

        return [
            'id' => self::generate_id('contact'),
            'name' => 'section',
            'settings' => [
                '_cssClasses' => ['contact-section'],
                '_padding' => [
                    'top' => '80px',
                    'bottom' => '80px',
                ],
            ],
            'children' => [
                self::container([
                    self::heading('Contact Us', 'h2', ['section-title']),
                    [
                        'id' => self::generate_id('contact_grid'),
                        'name' => 'div',
                        'settings' => ['_cssClasses' => ['contact-grid']],
                        'children' => $contact_items,
                    ],
                ]),
            ],
        ];
    }

    /**
     * Create an hours section
     */
    public static function hours_section($hours, $title = 'Hours') {
        $hours_items = [];

        foreach ($hours as $day_hours) {
            $hours_items[] = [
                'id' => self::generate_id('hours_item'),
                'name' => 'div',
                'settings' => ['_cssClasses' => ['hours-item']],
                'children' => [
                    self::text($day_hours['day'], ['hours-day']),
                    self::text($day_hours['hours'], ['hours-time']),
                ],
            ];
        }

        return [
            'id' => self::generate_id('hours'),
            'name' => 'section',
            'settings' => [
                '_cssClasses' => ['hours-section'],
                '_padding' => [
                    'top' => '80px',
                    'bottom' => '80px',
                ],
            ],
            'children' => [
                self::container([
                    self::heading($title, 'h2', ['section-title']),
                    [
                        'id' => self::generate_id('hours_list'),
                        'name' => 'div',
                        'settings' => ['_cssClasses' => ['hours-list']],
                        'children' => $hours_items,
                    ],
                ]),
            ],
        ];
    }
}
