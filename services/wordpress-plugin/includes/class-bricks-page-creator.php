<?php
/**
 * Bricks Page Creator
 * Handles creating WordPress pages with Bricks elements
 */

class Bricks_Page_Creator {

    /**
     * Create a restaurant page with Bricks elements
     */
    public static function create_restaurant_page($data) {
        // Validate required fields
        if (empty($data['name'])) {
            return new WP_Error('missing_name', 'Restaurant name is required');
        }

        // Build page elements
        $elements = [];

        // Hero section
        if (!empty($data['hero_image'])) {
            $elements[] = Bricks_Restaurant_Elements::hero_section([
                'name' => $data['name'],
                'tagline' => $data['tagline'] ?? 'Welcome to ' . $data['name'],
                'hero_image' => $data['hero_image'],
            ]);
        }

        // Menu section
        if (!empty($data['menu_items']) && is_array($data['menu_items'])) {
            $elements[] = Bricks_Restaurant_Elements::menu_section($data['menu_items']);
        }

        // Gallery section
        if (!empty($data['gallery_images']) && is_array($data['gallery_images'])) {
            $elements[] = Bricks_Restaurant_Elements::gallery_section($data['gallery_images']);
        }

        // Contact section
        if (!empty($data['phone']) || !empty($data['address']) || !empty($data['email'])) {
            $elements[] = Bricks_Restaurant_Elements::contact_section([
                'address' => $data['address'] ?? '',
                'phone' => $data['phone'] ?? '',
                'email' => $data['email'] ?? '',
            ]);
        }

        // Hours section
        if (!empty($data['hours']) && is_array($data['hours'])) {
            $elements[] = Bricks_Restaurant_Elements::hours_section($data['hours']);
        }

        // Create the WordPress page
        $page_data = [
            'post_title' => sanitize_text_field($data['name']),
            'post_status' => $data['status'] ?? 'draft',
            'post_type' => 'page',
            'post_name' => sanitize_title($data['name']),
        ];

        $post_id = wp_insert_post($page_data);

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        // Save Bricks content
        update_post_meta($post_id, BRICKS_DB_PAGE_CONTENT, $elements);

        // Set header and footer templates if provided
        if (!empty($data['header_template_id'])) {
            update_post_meta($post_id, '_bricks_page_header', $data['header_template_id']);
        }

        if (!empty($data['footer_template_id'])) {
            update_post_meta($post_id, '_bricks_page_footer', $data['footer_template_id']);
        }

        // Save custom metadata
        if (!empty($data['restaurant_phone'])) {
            update_post_meta($post_id, '_restaurant_phone', sanitize_text_field($data['phone']));
        }

        if (!empty($data['restaurant_address'])) {
            update_post_meta($post_id, '_restaurant_address', sanitize_text_field($data['address']));
        }

        return [
            'success' => true,
            'post_id' => $post_id,
            'url' => get_permalink($post_id),
            'edit_url' => admin_url('post.php?post=' . $post_id . '&action=edit'),
        ];
    }

    /**
     * Update an existing restaurant page
     */
    public static function update_restaurant_page($post_id, $data) {
        // Check if page exists
        $post = get_post($post_id);
        if (!$post) {
            return new WP_Error('page_not_found', 'Page not found');
        }

        // Get existing elements
        $existing_elements = get_post_meta($post_id, BRICKS_DB_PAGE_CONTENT, true);
        if (!is_array($existing_elements)) {
            $existing_elements = [];
        }

        // Update specific sections based on provided data
        $updated_elements = $existing_elements;

        // Update menu section if provided
        if (!empty($data['menu_items']) && is_array($data['menu_items'])) {
            // Find and replace menu section
            $updated_elements = self::replace_section_by_type($updated_elements, 'menu-section',
                Bricks_Restaurant_Elements::menu_section($data['menu_items'])
            );
        }

        // Update gallery section if provided
        if (!empty($data['gallery_images']) && is_array($data['gallery_images'])) {
            $updated_elements = self::replace_section_by_type($updated_elements, 'gallery-section',
                Bricks_Restaurant_Elements::gallery_section($data['gallery_images'])
            );
        }

        // Save updated Bricks content
        update_post_meta($post_id, BRICKS_DB_PAGE_CONTENT, $updated_elements);

        return [
            'success' => true,
            'post_id' => $post_id,
            'url' => get_permalink($post_id),
        ];
    }

    /**
     * Helper function to replace a section by CSS class
     */
    private static function replace_section_by_type($elements, $class_name, $new_section) {
        foreach ($elements as $index => $element) {
            if (isset($element['settings']['_cssClasses']) &&
                in_array($class_name, $element['settings']['_cssClasses'])) {
                $elements[$index] = $new_section;
                return $elements;
            }
        }

        // If not found, append
        $elements[] = $new_section;
        return $elements;
    }

    /**
     * Delete a restaurant page
     */
    public static function delete_restaurant_page($post_id) {
        $result = wp_delete_post($post_id, true);

        if (!$result) {
            return new WP_Error('delete_failed', 'Failed to delete page');
        }

        return [
            'success' => true,
            'post_id' => $post_id,
        ];
    }

    /**
     * Get page info
     */
    public static function get_page_info($post_id) {
        $post = get_post($post_id);

        if (!$post) {
            return new WP_Error('page_not_found', 'Page not found');
        }

        $elements = get_post_meta($post_id, BRICKS_DB_PAGE_CONTENT, true);

        return [
            'post_id' => $post_id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'status' => $post->post_status,
            'url' => get_permalink($post_id),
            'edit_url' => admin_url('post.php?post=' . $post_id . '&action=edit'),
            'element_count' => is_array($elements) ? count($elements) : 0,
        ];
    }
}
