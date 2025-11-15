<?php
/**
 * Plugin Name: Bricks API Bridge
 * Description: REST API endpoints for programmatic Bricks page creation
 * Version: 0.1.0
 * Author: AI Website Rebuilder
 * Requires at least: 5.6
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Plugin constants
define('BRICKS_API_BRIDGE_VERSION', '0.1.0');
define('BRICKS_API_BRIDGE_PATH', plugin_dir_path(__FILE__));
define('BRICKS_API_BRIDGE_URL', plugin_dir_url(__FILE__));

// Autoload classes
require_once BRICKS_API_BRIDGE_PATH . 'includes/class-bricks-restaurant-elements.php';
require_once BRICKS_API_BRIDGE_PATH . 'includes/class-bricks-api-endpoints.php';
require_once BRICKS_API_BRIDGE_PATH . 'includes/class-bricks-page-creator.php';

// Initialize plugin
function bricks_api_bridge_init() {
    // Check if Bricks is installed
    if (!defined('BRICKS_VERSION')) {
        add_action('admin_notices', 'bricks_api_bridge_missing_bricks_notice');
        return;
    }

    // Initialize API endpoints
    $api_endpoints = new Bricks_API_Endpoints();
    $api_endpoints->init();
}
add_action('plugins_loaded', 'bricks_api_bridge_init');

// Admin notice if Bricks is not installed
function bricks_api_bridge_missing_bricks_notice() {
    ?>
    <div class="notice notice-error">
        <p><?php _e('Bricks API Bridge requires Bricks Builder to be installed and activated.', 'bricks-api-bridge'); ?></p>
    </div>
    <?php
}

// Activation hook
register_activation_hook(__FILE__, 'bricks_api_bridge_activate');
function bricks_api_bridge_activate() {
    // Set default options
    add_option('bricks_api_bridge_version', BRICKS_API_BRIDGE_VERSION);

    // Flush rewrite rules
    flush_rewrite_rules();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'bricks_api_bridge_deactivate');
function bricks_api_bridge_deactivate() {
    // Flush rewrite rules
    flush_rewrite_rules();
}
