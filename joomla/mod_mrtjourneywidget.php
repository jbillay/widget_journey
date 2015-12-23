<?php
/**
 * Hello World! Module Entry Point
 * 
 * @package    Joomla.Tutorials
 * @subpackage Modules
 * @license    GNU/GPL, see LICENSE.php
 * @link       http://docs.joomla.org/J3.x:Creating_a_simple_module/Developing_a_Basic_Module
 * mod_mrtjourneywidget is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 */
 header('Content-Type: text/xml; charset=utf-8');
// No direct access
defined('_JEXEC') or die;
// Include the syndicate functions only once
require_once dirname(__FILE__) . '/helper.php';
 
$run_id = $params->get('run_id', '19');
$api_key = $params->get('api_key', 'XXX-XXX');
$display_size = $params->get('display_size', '1');

$document = JFactory::getDocument();
$document->addScript('https://maps.googleapis.com/maps/api/js');
$document->addStyleSheet('media/mod_mrtjourneywidget/css/mrt.css');

$hello = modMRTWidgetHelper::getHello($run_id, $api_key, $display_size);
require JModuleHelper::getLayoutPath('mod_mrtjourneywidget');

