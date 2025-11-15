<?php
/**
 * Bricks API Endpoints
 * REST API endpoints for Bricks page creation
 */

class Bricks_API_Endpoints {

    /**
     * Initialize API endpoints
     */
    public function init() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        $namespace = 'bricks-api/v1';

        // Health check endpoint
        register_rest_route($namespace, '/health', [
            'methods' => 'GET',
            'callback' => [$this, 'health_check'],
            'permission_callback' => '__return_true',
        ]);

        // Create restaurant page
        register_rest_route($namespace, '/create-restaurant-page', [
            'methods' => 'POST',
            'callback' => [$this, 'create_restaurant_page'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Update restaurant page
        register_rest_route($namespace, '/update-restaurant-page/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_restaurant_page'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Delete restaurant page
        register_rest_route($namespace, '/delete-restaurant-page/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_restaurant_page'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Get page info
        register_rest_route($namespace, '/page-info/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_page_info'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);
    }

    /**
     * Check permissions for API access
     */
    public function check_permissions($request) {
        // Check if user is authenticated
        if (!is_user_logged_in()) {
            // Try Bearer token authentication
            $auth_header = $request->get_header('authorization');

            if ($auth_header && strpos($auth_header, 'Bearer ') === 0) {
                $token = substr($auth_header, 7);
                // Validate API token (you should implement proper token validation)
                $valid_token = get_option('bricks_api_bridge_token');

                if ($token === $valid_token) {
                    return true;
                }
            }

            return new WP_Error(
                'rest_forbidden',
                __('You do not have permission to access this endpoint.'),
                ['status' => 401]
            );
        }

        // Check if user can edit posts
        if (!current_user_can('edit_posts')) {
            return new WP_Error(
                'rest_forbidden',
                __('You do not have permission to create pages.'),
                ['status' => 403]
            );
        }

        return true;
    }

    /**
     * Health check endpoint
     */
    public function health_check($request) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Bricks API Bridge is running',
            'version' => BRICKS_API_BRIDGE_VERSION,
            'bricks_version' => defined('BRICKS_VERSION') ? BRICKS_VERSION : 'not installed',
            'wp_version' => get_bloginfo('version'),
        ], 200);
    }

    /**
     * Create restaurant page endpoint
     */
    public function create_restaurant_page($request) {
        $params = $request->get_json_params();

        if (empty($params)) {
            return new WP_Error(
                'invalid_data',
                'No data provided',
                ['status' => 400]
            );
        }

        $result = Bricks_Page_Creator::create_restaurant_page($params);

        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'success' => false,
                'error' => $result->get_error_message(),
            ], 400);
        }

        return new WP_REST_Response($result, 201);
    }

    /**
     * Update restaurant page endpoint
     */
    public function update_restaurant_page($request) {
        $post_id = $request->get_param('id');
        $params = $request->get_json_params();

        if (empty($params)) {
            return new WP_Error(
                'invalid_data',
                'No data provided',
                ['status' => 400]
            );
        }

        $result = Bricks_Page_Creator::update_restaurant_page($post_id, $params);

        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'success' => false,
                'error' => $result->get_error_message(),
            ], 400);
        }

        return new WP_REST_Response($result, 200);
    }

    /**
     * Delete restaurant page endpoint
     */
    public function delete_restaurant_page($request) {
        $post_id = $request->get_param('id');

        $result = Bricks_Page_Creator::delete_restaurant_page($post_id);

        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'success' => false,
                'error' => $result->get_error_message(),
            ], 400);
        }

        return new WP_REST_Response($result, 200);
    }

    /**
     * Get page info endpoint
     */
    public function get_page_info($request) {
        $post_id = $request->get_param('id');

        $result = Bricks_Page_Creator::get_page_info($post_id);

        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'success' => false,
                'error' => $result->get_error_message(),
            ], 404);
        }

        return new WP_REST_Response($result, 200);
    }
}
