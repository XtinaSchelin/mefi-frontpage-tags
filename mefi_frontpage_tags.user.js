// ==UserScript==
// @name         MeFi Tags
// @namespace    https://github.com/XtinaSchelin/
// @version      0.1
// @description  Display MetaFilter post tags on the front page, for ease of filtering.
// @author       Xtina Schelin
// @match        https://www.metafilter.com/
// @grant        none
// ==/UserScript==

// The function to get and set tags.
function get_tags(href) {
    $.get( $base_url + "/" + href, function( data ) {
        var post_id = href.split("/")[1];
        $tag_id = "post_tags_" + post_id;
        var allTags = [];
        // Get each tag on that page.
        while ((myArray = linkRe.exec(data)) !== null) {
            allTags.push(myArray[0].match(tagRe)[1]);
        }
        // Put it all together.
        document.getElementById($tag_id).innerHTML = "Tags: " + allTags.join(", ");
        document.getElementById($tag_id).setAttribute("class", "tagged");
    });
}

// Set up some basics.
$base_url = "https://www.metafilter.com";
var linkRe = /<a class="taglink" href="[^"]+"  rel="tag" title="[^"]+">[^<]+<\/a>/g;
var tagRe = />([^<]+)</;
var idRe = /<link rel="canonical" href="http:..www.metafilter.com.([0-9]+)\//;

// For each post on the page...
$("#posts div.copy.post span.postbyline").each(function( index ) {
    // Get the post link.
    $href = $(this).children()[1].getAttribute("href");
    // Create and append the new tags line.
    $tag_id = "post_tags_" + $href.split("/")[1];
    $tag_link = "<div class='untagged' style='font-size: 12px; line-height:14px; margin-top: 5px; padding-top: 5px; border-top: 1px solid #668;' id='" + $tag_id + "'></div>";
    $(this).append($tag_link);
    // Get the tags, woo.
    get_tags($href);
});
