// ==UserScript==
// @name         MeFi Tags
// @namespace    https://github.com/XtinaSchelin/
// @version      0.1
// @description  Display MetaFilter post tags on the front page, for ease of filtering.
// @author       Xtina Schelin
// @match        https://*.metafilter.com/*
// @grant        none
// ==/UserScript==

// The function to get and set tags.
function get_tags(href) {
    if (href.substr(0, 4) != "http")
    {
        href = $base_url + "/" + href;
    }
    href = href.replace(".com//", ".com/");
    $.get( href, function( data ) {
        var post_id = href.split("/")[3];
        $tag_id = "post_tags_" + post_id;
        var allTags = [];
        // Get each tag on that page.
        while ((myArray = linkRe.exec(data)) !== null) {
            $cur_tag = myArray[0].match(tagRe)[1];
            allTags.push($href_pre + $cur_tag + $href_mid + $cur_tag + $href_suf);
        }
        // Put it all together.
        document.getElementById($tag_id).innerHTML = "Tags: " + allTags.join(", ");
        document.getElementById($tag_id).setAttribute("class", "tagged");
    });
}

// Do we bother on this page at all?
if ($("h1.posttitle").length === 0)
{
    // Set up some basics.
    $base_url = "https://" + window.location.hostname;
    var linkRe = /<a class="taglink" href="[^"]+"  rel="tag" title="[^"]+">[^<]+<\/a>/g;
    var tagRe = />([^<]+)</;
    var commRe = /^[0-9]+ comments?$/;
    $href_pre = "<a href='" + $base_url + "/tags/";
    $href_mid = "'>";
    $href_suf = "</a>";

    // For each post on the page...
    $("#posts div.copy.post span[class*='byline']").each(function( index ) {
        // Get the post link.
        $href = '';
        for (var q = 0; q < $(this).find("a").length; q++)
        {
            $href_text = $(this).find("a")[q].innerHTML;
            if ($href_text.match(commRe) !== null)
            {
                $href = $(this).find("a")[q].getAttribute("href");
                break;
            }
        }
        // Create and append the new tags line.
        $tag_id = "post_tags_" + $href.split("/")[1];
        $tag_link = "<div class='untagged' style='font-size: 12px; line-height:14px; margin-top: 5px; padding: 5px 0 3px; border-top: 1px solid #668;' id='" + $tag_id + "'>Tags: </div>";
        $(this).append($tag_link);
        // Get the tags, woo.
        get_tags($href);
    });
}